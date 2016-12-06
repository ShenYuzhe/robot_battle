var co = require('co');

var warehouse = require('../fs/warehouse');
var mvExFile = warehouse.mvExFile;
var playground = require('../core/playground');
var robot = require('../core/robot');

var db = require('../db/mongoAgent');
var createDriver = db.createDriver;
var listDriverShop = db.listDriverShop;
var listRobotShop = db.listRobotShop;
var Robot = robot.Robot;

function createRobot(req, res) {
	var robot = req.body;
	co (
		function* () {
			db.createRobot(robot);		
			res.status(200).send('robot created');
		}
	).catch(
		(err) => {
			res.status(500).send('robot creating failed');
		}
	);

}
exports.createRobot = createRobot;

function listRobots(req, res) {
	co(
		function* () {
			robots = yield listRobotShop();
			res.status(200).send(robots);
		}
	).catch(
		(err) => {
			console.log(err);
			res.status(404).send('robots not found');
		}
	);
}
exports.listRobots = listRobots;

function uploadDriver(req, res) {
	if (!req.files) {
		res.status(400).send('missing driver');
	}

	var driver = req.files.driver,
		name = req.params.name,
		path = warehouse.driverShopDir + '/' + name + '.js';

	co(
		function* () {
			mvExFile(driver, path);
			yield createDriver(name, path);
			res.status(200).send('upload driver succeed');
		}
	).catch(
		(err) => {
			console.log(err);
			res.status(500).send('upload driver error');
		}
	);
}
exports.uploadDriver = uploadDriver;

function listDrivers(req, res) {
	co(
		function* () {
			drivers = yield listDriverShop();
			res.status(200).send(drivers);
		}
	).catch(
		(err) => {
			res.status(404).send('drivers not found');
		}
	);
}
exports.listDrivers = listDrivers;

var randomToken = require('random-token');
var queue = require('queue');
var tokenDigits = 16;

var trainGround = {};

function fight(req, res) {

    var token = randomToken(tokenDigits),
        q = queue();
    trainGround[token] = q;
    res.status(201).send({
        'battle_token': token,
        'message': 'please refer to this token to watch battle'}
    );

	var driverLName = req.query.driver1,
		driverRName = req.query.driver2,
		modelLName = req.query.model1,
		modelRName = req.query.model2;

	co(
		function* () {
			var modelLhs = yield db.getShopRobotByModel(modelLName),
				modelRhs = yield db.getShopRobotByModel(modelRName),
				driverLhs = warehouse.shopDriverByName(driverLName),
				driverRhs = warehouse.shopDriverByName(driverRName);

			var robotLhs = new Robot(modelLhs, driverLhs),
				robotRhs = new Robot(modelRhs, driverRhs);

			var fightGround = new playground.PlaygroundBuilder()
				.withGrid(100, 100)
				.withRobots(robotRhs, robotLhs)
				.build();

			fightGround.fight((roundReport) => {
                q.push(roundReport);
            });
            
		}
	).catch (
        (err) => {
            console.log(err);
        }    
    );
}
exports.fight = fight;

function watch (ws, req) {
    reqList = {
        'token': (msgObj) => {
            var token = msgObj.token;
            var q = trainGround[token];
            if (undefined == q)
                return;
            var resMsg = null;
            if (undefined == (resMsg = q.shift()))
                return;
            ws.send(JSON.stringify(resMsg));
            if (undefined != resMsg.winner)
                delete trainGround[token];        
        }
    };
    
    ws.on('message', (msg) => {
        var msgObj = JSON.parse(msg);
        reqList[msgObj.action](msgObj);
    });
};
exports.watch = watch;
