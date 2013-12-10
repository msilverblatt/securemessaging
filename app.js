var express = require("express");
var app = express();
var mongo = require('mongodb');

var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/mydb';

// Routes
app.get('/', function(req, res) {
  res.sendfile('public/index.html');
});

app.get('/send', function(req, res) {
  res.sendfile('public/send.html');
});

app.get('/receive', function(req, res) {
  res.sendfile('public/receive.html');
});

app.get('/register', function(req, res) {
  res.sendfile('public/register.html');
});


// Server configuration
var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});