var MongoClient = require('mongodb').MongoClient;
var q = require('q');
var assert = require('assert');
var Promise = require('promise');
var co = require('co');

var url = 'mongodb://127.0.0.1:27017/yeah';
var dbClient;

var insert = function(db) { 
    var collection = db.collection('documents');
    var deferred = q.defer();
    collection.insert({'a':'b'}, function(err, result) {
      deferred.resolve(result);  
    });
    return deferred.promise
}

var read = function(db) {

    var collection = db.collection('test');
    var deferred = q.defer();
    collection.find({}).toArray(function(err, docs) {
        deferred.resolve(docs);;
    });
    return deferred.promise;
}

var createIndex = function(db) {
    var collection = db.collection('test_idx');
    var deferred = q.defer();
    collection.createIndex({age: 1}, function(err, res) {
        deferred.resolve(res);
    });
    return deferred.promise;
}

/*MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
        console.log("Connected correctly to server.");
    //insert(db);
    //read(db);
    var collection = db.collection('lala');
    collection.createIndex({age: -1}, {unique: true},
            function(err, res) {
                console.log(res);
                db.close();
            });
});*/

function withDb(callback) {
    var deferred = q.defer();
    MongoClient.connect(url, function(err, db) {
        if (err)
            deferred.reject(err);
        deferred.resolve(db);
    });
    return co(
        function* () {
            var db = yield deferred.promise;
            var res = yield createIndex(db);
            db.close();
            return res;
        }
    );
    /*var db;
    return deferred.promise.then(
        function(res) {
            db = res;
            return callback(db);
        }
    ).then(
        function(res) {
            var result = q.defer();
            result.resolve(res);
            db.close();
            return result.promise;
        }
    );*/
}

function test() {
     console.log('empty');
}

/*function test(arg) {
    console.log(arg);
}

test();
test('hello');*/
withDb(createIndex).then(console.log);
