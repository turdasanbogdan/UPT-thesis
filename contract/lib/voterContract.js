/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';


const { Contract } = require('fabric-contract-api');
const path = require('path');
const fs = require('fs');

const electionDataPath = path.join(process.cwd(), './lib/data/electionData.json');
const electionDataJson = fs.readFileSync(electionDataPath, 'utf8');
const electionData = JSON.parse(electionDataJson);

const ballotDataPath = path.join(process.cwd(), './lib/data/presElection.json');
const ballotDataJson = fs.readFileSync(ballotDataPath, 'utf8');
const ballotData = JSON.parse(ballotDataJson);


let Ballot = require('./Ballot.js');
let Election = require('./Election.js');
let Voter = require('./Voter.js');
let VotableItem = require('./VotableItem.js');

class MyAssetContract extends Contract {

  async init(ctx) {

    console.log('instantiate was called!');

    let voters = [];
    let votableItems = [];
    let elections = [];
    let election;

    //create voters
    let voter1 = await new Voter('V1', '1980916000000', 'Bogdan', 'Turdasan');
    let voter2 = await new Voter('V2', '1980916111111', 'Mihai', 'Udrescu');

    //update voters array
    voters.push(voter1);
    voters.push(voter2);

    //add the voters to the world state, the election class checks for registered voters 
    await ctx.stub.putState(voter1.voterId, Buffer.from(JSON.stringify(voter1)));
    await ctx.stub.putState(voter2.voterId, Buffer.from(JSON.stringify(voter2)));

    //query for election first before creating one.
    let currElections = JSON.parse(await this.queryByObjectType(ctx, 'election'));

    if (currElections.length === 0) {

      //Nov 3 is election day
      let electionStartDate = await new Date(2021, 6, 15);
      let electionEndDate = await new Date(2021, 6, 16);

      //create the election
      election = await new Election(electionData.electionName, electionData.electionCountry,
        electionData.electionYear, electionStartDate, electionEndDate);

      //update elections array
      elections.push(election);

      await ctx.stub.putState(election.electionId, Buffer.from(JSON.stringify(election)));

    } else {
      election = currElections[0];
    }

    //create votableItems for the ballots
    let proiect1 = await new VotableItem(ctx, 'proiect1', ballotData.proiect1);
    let proiect2 = await new VotableItem(ctx, 'proiect2', ballotData.proiect2);
    let proiect3 = await new VotableItem(ctx, 'proiect3', ballotData.proiect3);
    let proiect4 = await new VotableItem(ctx, 'proiect4', ballotData.proiect4);
    let proiect5 = await new VotableItem(ctx, 'proiect5', ballotData.proiect5);

    //console.log(ballotData);
    //populate choices array so that the ballots can have all of these choices 
     votableItems.push(proiect1);
    votableItems.push(proiect2);
    votableItems.push(proiect3);
    votableItems.push(proiect4);
    votableItems.push(proiect5);

    for (let i = 0; i < votableItems.length; i++) {
    
      //save votable choices in world state
      await ctx.stub.putState(votableItems[i].votableId, Buffer.from(JSON.stringify(votableItems[i])));

    }

    //generate ballots for all voters
    for (let i = 0; i < voters.length; i++) {

      if (!voters[i].ballot) {

        //give each registered voter a ballot
        await this.generateBallot(ctx, votableItems, election, voters[i]);

      } else {
        console.log('these voters already have ballots');
        break;
      }

    }

    return voters;

  }

  async generateBallot(ctx, votableItems, election, voter) {

    //generate ballot
    let ballot = await new Ballot(ctx, votableItems, election, voter.voterId);
    
    //set reference to voters ballot
    voter.ballot = ballot.ballotId;
    voter.ballotCreated = true;

    // //update state with ballot object we just created
    await ctx.stub.putState(ballot.ballotId, Buffer.from(JSON.stringify(ballot)));

    await ctx.stub.putState(voter.voterId, Buffer.from(JSON.stringify(voter)));

  }



  async createVoter(ctx, args) {

    args = JSON.parse(args);

    //create a new voter
    let newVoter = await new Voter(args.voterId, args.registrarId, args.firstName, args.lastName);

    //update state with new voter
    await ctx.stub.putState(newVoter.voterId, Buffer.from(JSON.stringify(newVoter)));

    //query state for elections
    let currElections = JSON.parse(await this.queryByObjectType(ctx, 'election'));

    if (currElections.length === 0) {
      let response = {};
      response.error = 'no elections. Run the init() function first.';
      return response;
    }

    //get the election that is created in the init function
    let currElection = currElections[0];

    let votableItems = JSON.parse(await this.queryByObjectType(ctx, 'votableItem'));
    
    //generate ballot with the given votableItems
    await this.generateBallot(ctx, votableItems, currElection, newVoter);

    let response = `voter with voterId ${newVoter.voterId} is updated in the world state`;
    return response;
  }


  async deleteMyAsset(ctx, myAssetId) {

    const exists = await this.myAssetExists(ctx, myAssetId);
    if (!exists) {
      throw new Error(`The my asset ${myAssetId} does not exist`);
    }

    await ctx.stub.deleteState(myAssetId);

  }

  async readMyAsset(ctx, myAssetId) {

    const exists = await this.myAssetExists(ctx, myAssetId);

    if (!exists) {
      // throw new Error(`The my asset ${myAssetId} does not exist`);
      let response = {};
      response.error = `The my asset ${myAssetId} does not exist`;
      return response;
    }

    const buffer = await ctx.stub.getState(myAssetId);
    const asset = JSON.parse(buffer.toString());
    return asset;
  }



  async myAssetExists(ctx, myAssetId) {

    const buffer = await ctx.stub.getState(myAssetId);
    return (!!buffer && buffer.length > 0);

  }

  async castVote(ctx, args) {
    args = JSON.parse(args);

    //get the political party the voter voted for, also the key
    let votableId = args.picked;

    //check to make sure the election exists
    let electionExists = await this.myAssetExists(ctx, args.electionId);

    if (electionExists) {

      //make sure we have an election
      let electionAsBytes = await ctx.stub.getState(args.electionId);
      let election = await JSON.parse(electionAsBytes);
      let voterAsBytes = await ctx.stub.getState(args.voterId);
      let voter = await JSON.parse(voterAsBytes);

      if (voter.ballotCast) {
        let response = {};
        response.error = 'this voter has already cast this ballot!';
        return response;
      }

      //check the date of the election, to make sure the election is still open
      let currentTime = await new Date(2021, 6, 15);

      //parse date objects
      let parsedCurrentTime = await Date.parse(currentTime);
      let electionStart = await Date.parse(election.startDate);
      let electionEnd = await Date.parse(election.endDate);

      //only allow vote if the election has started 
      if (parsedCurrentTime >= electionStart && parsedCurrentTime < electionEnd) {

        let votableExists = await this.myAssetExists(ctx, votableId);
        if (!votableExists) {
          let response = {};
          response.error = 'VotableId does not exist!';
          return response;
        }

        //get the votable object from the state - with the votableId the user picked
        let votableAsBytes = await ctx.stub.getState(votableId);
        let votable = await JSON.parse(votableAsBytes);

        //increase the vote of the political party that was picked by the voter
        await votable.count++;

        //update the state with the new vote count
        let result = await ctx.stub.putState(votableId, Buffer.from(JSON.stringify(votable)));
        console.log(result);

        //make sure this voter cannot vote again! 
        voter.ballotCast = true;
        voter.picked = {};
        voter.picked = args.picked;

        //update state to say that this voter has voted, and who they picked
        let response = await ctx.stub.putState(voter.voterId, Buffer.from(JSON.stringify(voter)));
        console.log(response);
        return voter;

      } else {
        let response = {};
        response.error = 'the election is not open now!';
        return response;
      }

    } else {
      let response = {};
      response.error = 'the election or the voter does not exist!';
      return response;
    }
  }


  async queryAll(ctx) {

    let queryString = {
      selector: {}
    };

    let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
    return queryResults;

  }


  async queryWithQueryString(ctx, queryString) {

    console.log('query String');
    console.log(JSON.stringify(queryString));

    let resultsIterator = await ctx.stub.getQueryResult(queryString);

    let allResults = [];

    // eslint-disable-next-line no-constant-condition
    while (true) {
      let res = await resultsIterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};

        console.log(res.value.value.toString('utf8'));

        jsonRes.Key = res.value.key;

        try {
          jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
        } catch (err) {
          console.log(err);
          jsonRes.Record = res.value.value.toString('utf8');
        }

        allResults.push(jsonRes);
      }
      if (res.done) {
        console.log('end of data');
        await resultsIterator.close();
        console.info(allResults);
        console.log(JSON.stringify(allResults));
        return JSON.stringify(allResults);
      }
    }
  }


  async queryByObjectType(ctx, objectType) {

    let queryString = {
      selector: {
        type: objectType
      }
    };

    let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
    return queryResults;

  }
}
module.exports = MyAssetContract;
