'use strict';

var MongoClient = require('mongodb').MongoClient;
var db, dbname, app;

exports.initialize = function(name, application){
  dbname = name;
  app = application;
  return connect;
};

function connect(req, res, next){
  if(!db){
    var connection = 'mongodb://localhost/' + dbname;

    MongoClient.connect(connection, function(err, tmpDb) {
      if(err){throw err;}
      db = tmpDb;
      app.locals.db = db;
      console.log('Connected to MongoDB');

      next();
    });
  } else {
    next();
  }
}

