RobotModel = require('../robot');

Robot = RobotModel.Robot;
Driver = RobotModel.Driver;

attributeStrong = {
    'health': 500,
    'attack': 80,
    'energy': 3
}

// instance for strong but gentle user
strongDriver = new Driver('Jerry');

exports.strongRobot = new Robot(attributeStrong, strongDriver);
