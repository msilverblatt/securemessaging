process.env.MONGOHQ_URL = "mongodb://admin:admin@paulo.mongohq.com:10095/app19374375"
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
    console.log(obj);
    if (obj.user && obj.pubkey) {
        db.collection("users", function(error, collection) {
            collection.insert({user: obj.user, pubkey: obj.pubkey}, function(error, records) {
                if (error) {
                    console.log(error);
                    return res.send("registerError");
                }
                else{
                    return res.send("registerSuccess");
                }
            });

        });
    }
    else{
        return response.send("inputError");
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
        return response.send("inputError");
    }
}

exports.getmessages = function(req, res)
{
    var obj = req.body;
    if (obj.user) {
        db.collection("messages", function(error, collection) {
            collection.find({recipient:obj.user}, {symkey: 0, file: 0, recipient: 0}).toArray(function(error, items) {
                if (error) {
                    return res.send("getmessagesError");
                }
                else{
                    return res.send(items);
                }
            });
        });
    }
    else{
        return response.send("inputError");
    }
}

exports.getmessage = function(req, res)
{
    var obj = req.body;
    if (obj._id) {
        db.collection("messages", function(error, collection) {
            collection.findOne({_id: obj._id}, {file: 1, symkey: 1}, function(error, doc) {
                if (error) {
                    return res.send("getmessageError");
                }
                else{
                    collection.remove({_id: obj._id}, true, function(error, removed) {
                        if (error) {
                            console.log("Error removing message: " + obj._id);
                        }
                        return res.send(doc);
                    });
                }
            });
        });
    }
    else{
        return response.send("inputError");
    }
}

exports.pubkey = function(req, res)
{
    var obj = req.body;
    if (obj.user) {
        db.collection("users", function(error, collection) {
            collection.findOne({user: obj.user}, {pubkey: 1}, function(error, doc) {
                if (error) {
                    return res.send("pubkeyError");
               }
                else{
                    return res.send(doc.pubkey);
                }
            });
        });
    }
    else{
        return response.send("inputError");
    }
}
