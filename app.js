var express = require("express");
var logfmt = require("logfmt");
var app = express();

app.use(logfmt.requestLogger());


// Routes
app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.get('/send', function(req, res) {
  res.send('Send page');
});

app.get('/receive', function(req, res) {
  res.send('Receive page');
});


// Server configuration
var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});