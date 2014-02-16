'use strict';

module.exports = function(gadget){
  this.name = gadget.name || '';
  this.cost = parseInt(gadget.cost || 0);
  this.amount = parseInt(gadget.amount || 0);
  this.picture = gadget.picture || '';
};
