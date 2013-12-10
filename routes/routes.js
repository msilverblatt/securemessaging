process.env.MONGOHQ_URL = "mongodb://admin:admin@paulo.mongohq.com:10095/app19374375"
var mongoURI = "mongodb://localhost/test"
var mongodb = require("mongodb")

var db = mongodb.Db.connect(process.env.MONGOHQ_URL, function(error, client) {
    if (error) {
        return console.log(error);
    }
    return db = client;
});

exports.register = function(req, res)
{
    var obj = req.body;
    if (obj.user && obj.pubkey) {
        db.collection("users", function(error, collection) {
            collection.insert({user: obj.user, pubkey: obj.pubkey}, function(error, records) {
                if (error) {
                    return res.send("userError");
                }
                else{
                    return res.send("userSuccess");
                }
            });
        });
    }
    else{
        return response.send("Invalid Registration Input");
    }
}

exports.pubkey = function(req, res)
{
    var obj = req.body;
    if (obj.user) {
        db.collection("users", function(error, collection) {
            collection.findOne({user: obj.user}, function(error, doc) {
                if (error) {
                    return res.send("pubkeyError");
                }
                else{
                    return res.send(doc.pubkey);
                }
            });
        });
    }
}

exports.send = function(req, res)
{
    var obj = req.body;
    if (obj.recipient && obj.symkey && obj.file && obj.sender) {
        db.collection("messages", function(error, collection) {
            collection.insert({file: obj.file, symkey: obj.symkey, recipient: obj.recipient, sender: obj.sender}, function(error, records) {
                if (error) {
                    return res.send("sendError");
                }
                else{
                    return res.send("sendSuccess");
                }
            });
        });
    }
    else{
        return response.send("Invalid Registration Input");
    }
}

exports.getmessages = function(req, res)
{
    var obj = req.body;
    if (obj.user) {
        db.collection("messages", function(error, collection) {
            collection.find({user: obj.user}, {file: 0, recipient: 0, sender: 0, symkey: 0}).toArray(function(error, items) {
                if (error) {
                    return res.send("getmessagesError");
                }
                else{
                    return res.send(items);
                }
            });
        });
    }
}
