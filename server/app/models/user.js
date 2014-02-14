'use strict';

module.exports = function(user){
  this.name = user.name || '';
  this.balance = parseInt(user.balance || 0);
  this.purchases = user.purchases ? user.purchases.split(', ') :[];
};
