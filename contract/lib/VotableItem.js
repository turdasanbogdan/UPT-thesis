/* eslint-disable indent */
'use strict';

class VotableItem {

  constructor(ctx, votableId, description) {

    this.votableId = votableId;
    this.description = description;
    this.count = 0;
    this.type = 'votableItem';
    if (this.__isContract) {
      delete this.__isContract;
    }
    return this;

  }
}
module.exports = VotableItem;