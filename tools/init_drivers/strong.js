var libs = require('../../libs').collect;
var RobotModel = libs.robot;
Robot = RobotModel.Robot;
Driver = RobotModel.Driver;

// instance for strong but gentle user
strongDriver = new Driver('Jerry');
exports.driver = strongDriver;