var warehouse = require('../fs/warehouse');
var mvExFile = warehouse.mvExFile;

var mongoAgent = require('../db/mongoAgent');
var createDriver = mongoAgent.createDriver;
var createRobot = mongoAgent.createRobot;

function createRobot(req, res) {
	
}
exports.createRobot = createRobot;

function listRobots(req, res) {

}
exports.listRobots = listRobots;

function uploadDriver(req, res) {
	if (!req.files) {
		res.status(400).send('missing robot');
	}

	var driver = req.files.driver,
		name = req.files.name,
		path = warehouse.robotShopDir + '/' + name + '.json';

	co(
		function* () {
			mvExFile(driver, path);
			createDriver(name, path);
			res.status(200).send('upload driver succeed');
		}
	).catch(
		(err) => {
			res.status(500).send('upload driver error');
		}
	);
}


function fight(req, res) {

}
exports.fight = fight;
