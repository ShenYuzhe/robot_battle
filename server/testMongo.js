var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://127.0.0.1:27017/test';

var insert = function(db) { 
    var collection = db.collection('documents');

    collection.insert({'a':'b'}, function(err, result) {
        console.log(result);
    })
}

var read = function(db) {

    var collection = db.collection('test');

    collection.find({}).toArray(function(err, docs) {
        console.log(docs);
    });
}

MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
        console.log("Connected correctly to server.");
    insert(db);
    read(db);
    db.close();
});


