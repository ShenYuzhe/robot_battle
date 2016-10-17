var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://127.0.0.1:27017/yeah';
var dbClient;

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

var Singleton = (function () {
    var instance;
 
    function createInstance() {
        var object = new Object("I am the instance");
        return object;
    }
 
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();
 
function run() {
 
    var instance1 = Singleton.getInstance();
    var instance2 = Singleton.getInstance();
 
    console.log("Same instance? " + (instance1 === instance2));  
}
run();




