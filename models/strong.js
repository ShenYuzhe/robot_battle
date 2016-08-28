RobotModel = require('../robot');

Robot = RobotModel.Robot;
Action = RobotModel.Action;

attributeStrong = {
    'health': 500,
    'attack': 80
}

// instance for strong but gentle user
strongAction = new Action('Jerry');

exports.strongRobot = new Robot(attributeStrong, strongAction);
