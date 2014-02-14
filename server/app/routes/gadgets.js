'use strict';

var Gadget = require('../models/gadget');
var Mongo = require('mongodb');

exports.create = function(req, res){
  var db = req.app.loacls.db;
  var gadgets = db.collection('gadgets');

  var gadget = new Gadget(req.body);
  gadgets.insert(gadget, function(err, records){
    res.send(records[0]);
  });
};

exports.index = function(req, res){
  var db = req.app.loacls.db;
  var gadgets = db.collection('gadgets');
  gadgets.find().toArray(function(err, records){
    res.send({gadgets:records});
  });
};

exports.update = function(req, res){
  var db = req.app.loacls.db;
  var gadgets = db.collection('gadgets');

  var gadget = new Gadget(req.body);
  var id = Mongo.ObjectID(req.params.id);
  var query = {_id : id};

  gadgets.update(query, gadget, function(err, count){
    res.send({updated:count, id:req.params.id, gadget:gadget});
  });
};

exports.delete = function(req, res){
  var db = req.app.loacls.db;
  var gadgets = db.collection('gadgets');

  var id = Mongo.ObjectID(req.params.id);
  var query = {_id : id};

  gadgets.remove(query, function(err, count){
    res.send({deleted:count, id:req.params.id});
  });
};

