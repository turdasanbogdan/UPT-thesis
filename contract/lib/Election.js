'use strict';

class Election {


  async validateElection(electionId) {

    //registrarId error checking here, i.e. check if valid drivers License, or state ID
    if (electionId) {
      return true;
    } else {
      return false;
    }
  }

  constructor(name, country, year, startDate, endDate) {
    
    this.electionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    if (this.validateElection(this.electionId)) {

      //create the election object
      this.name = name;
      this.country = country;
      this.year = year;
      this.startDate = startDate;
      this.endDate = endDate;
      this.type = 'election';
      if (this.__isContract) {
        delete this.__isContract;
      }
      return this;

    } else {
      throw new Error('not a valid election!');
    }

  }

}
module.exports = Election;