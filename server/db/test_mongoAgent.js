var co = require('co');
var assert = require('assert');

var mongoAgent = require('./mongoAgent');
var createRobot = mongoAgent.createRobot;
var getRobotByModel = mongoAgent.getRobotByModel;

/*co(
	function* () {
		var sample_robot = require('./sample_robot.json');
		var result = yield createRobot(sample_robot);
		var robots = yield getRobotByModel("merchant", "sample");
		var robot = robots[0];
		assert.deepEqual(robot, sample_robot);
	}
).catch(
	function(err) {
		console.log(err);
	}
);
console.log("create and grab robot case passes");*/

mongoAgent.createUniqueRobotIndex().then(console.log);
