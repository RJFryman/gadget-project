'use strict';

var dbname = 'gadget-express';
var port = process.env.PORT || 4000;

var d = require('./lib/request-debug');
var express = require('express');
var home = require('./routes/home');
var users = require('./routes/users');
var gadgets = require('./routes/gadgets');
var app = express();

/* --- pipeline begins */
app.use(require('./lib/mongodb-connection-pool').initialize(dbname, app));
app.use(express.logger(':remote-addr -> :method :url [:status]'));
app.use(require('./lib/cors'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.get('/', d, home.index);
app.get('/users', d, users.index);
app.post('/users', d, users.create);
app.put('/users/:id', d, users.update);
app.delete('/users/:id', d, users.delete);
app.get('/gadgets', d, gadgets.index);
app.post('/gadgets', d, gadgets.create);
app.put('/gadgets/:id', d, gadgets.update);
app.delete('/gadgets/:id', d, gadgets.delete);
/* --- pipeline ends   */

var server = require('http').createServer(app);
server.listen(port, function(){
  console.log('Node server listening. Port: ' + port + ', Database: ' + dbname);
});

