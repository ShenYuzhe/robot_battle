RobotModel = require('../robot');

Robot = RobotModel.Robot;
Driver = RobotModel.Driver;

attributeStrong = {
    'health': 500,
    'attack': 80,
    'arm': 10,
    'energy': 3,
    'reach': 10,
    'rotate': 180,
    'strength': 50,
    'sight': {
    	'distance': 15,
    	'width': Math.PI / 3
    }
}

// instance for strong but gentle user
strongDriver = new Driver('Jerry');
exports.driver = strongDriver;
exports.strongRobot = new Robot(attributeStrong, strongDriver);
