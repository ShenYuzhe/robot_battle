RobotModel = require('../robot');
basic = require('../basic');
geometry = require('../../utils/geometry');

Robot = RobotModel.Robot;
Driver = RobotModel.Driver;

// instance for agressive user
attributeAgressive = {
    'health': 300,
    'attack': 100,
    'arm': 10,
    'energy': 3,
    'reach': 15,
    'rotate': 180,
    'strength': 50,
    'sight': {
    	'distance': 15,
    	'width': Math.PI / 3 
    }
}

aggressiveDriver = new Driver('tom');


Move = basic.Move;
Attack = basic.Attack;
Defense = basic.Defense;

Point = geometry.Point;

aggressiveDriver.act = function(attribute, context) {
    return [Move(Point(0, 0)), Attack(100)];
}

aggressiveDriver.onAttack = function(hurt) {
    console.log('holy shit');
}

exports.aggressiveRobot = new Robot(attributeAgressive, aggressiveDriver);
exports.driver = aggressiveDriver;