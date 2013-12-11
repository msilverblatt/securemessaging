var express = require("express");
var app = express();
app.use(express.bodyParser());

// Server configuration
var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

var routes = require('./routes/routes');
//get requests
app.get('/', function(req, res) {
  res.sendfile('public/register.html');
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

app.use(express.static(__dirname + '/public'));

//post requests
app.post('/register', routes.register);
app.post('/send', routes.send);
app.post('/getmessages', routes.getmessages);
app.post('/getmessage', routes.getmessage);
app.post('/pubkey', routes.pubkey);
