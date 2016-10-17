var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var q = require('q');
var co = require('co');

/* singleton url initialization */
var endpoint = (function() {
	var instance;

	function createInstance() {
		instance = 'mongodb://127.0.0.1:27017/test'
		return instance;
	}

	return {
		getInstance: function() {
			if (!instance)
				instance = createInstance();
			return instance;
		}
	};

})();

/* 
	basic encapsulation of
	low level utils 
*/
function connectUser(usr, callback) {

	MongoClient.connect(endpoint.getInstance(),
		function(err, db) {
			assert.equal(null, err);
			callback(db.collection(usr));
			db.close();
		});
}

function insert(usr, data) {
	var deferred = q.defer();
	connectUser(usr, function(collection) {
		collection.insert(data, function(err, result) {
			assert.equal(null, err);
			deferred.resolve(result);
		});
	});
	return deferred.promise;
}
exports.insert = insert;

function read(usr, query, callback) {
	var deferred = q.defer();
	connectUser(usr, function(collection) {
		collection.find(query).toArray(function(err, docs) {
			assert.equal(null, err);
			deferred.resolve(docs);
		});
	});
	return deferred.promise;
}
exports.read = read;

function QueryBuilder() {

	this.query = {};

	QueryBuilder.prototype.withType = function(type) {
		this.query.type = type;
		return this;
	};

	QueryBuilder.prototype.withUser = function(id) {
		this.query.id = id;
		return this;
	}

	QueryBuilder.prototype.withName = function(name) {
		this.query.name = name;
		return this;
	}

	QueryBuilder.prototype.withModel = function(model) {
		this.query.model = model;
		return this;
	}

	QueryBuilder.prototype.build = function() {
		return this.query;
	};
}
exports.QueryBuilder = QueryBuilder;

/* 
	advanced version of APIs 
*/
function getProfile(usr) {
	var query = new QueryBuilder()
						.withType('profile')
						.build();
	return read(usr, query);
};
exports.getProfile = getProfile;

function getRobotByName(usr, name) {
	var query = new QueryBuilder()
						.withType('robot')
						.withName(name)
						.build();
	return read(usr, query);
}
exports.getRobotByName = getRobotByName;

function getRobotByModel(usr, model) {
	var query = new QueryBuilder()
						.withType('robot')
						.withModel(model)
						.build();
	return read(usr, query);
}
exports.getRobotByModel = getRobotByModel;

function getRobotByNameModel(usr, name, model) {
	var query = new QueryBuilder()
						.withName(name)
						.withModel(model)
						.build();
	return read(usr, query);
}

var merchant = "merchant"
function assignUserRobot(usr, model, name) {
	return co(function* () {
		var robot = yield getRobotByModel(merchant, model);
		robot.name = name;
		return yield insert(usr, robot);
	});
}
exports.assignUserRobot = assignUserRobot;

co(
	function* () {
		var deferred = q.defer();
		deferred.resolve("hello world");
		return "hello world";
	}
).then(function(val) {console.log(val)});

