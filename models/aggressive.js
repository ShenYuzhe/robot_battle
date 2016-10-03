RobotModel = require('../robot');
basic = require('../basic');

Robot = RobotModel.Robot;
Driver = RobotModel.Driver;

Vector = basic.Vector;
Attack = basic.Attack;
createAction = basic.createAction;

// instance for agressive user
attributeAgressive = {
    'health': 300,
    'attack': 100,
    'energy': 3,
    'reach': 15,
    'sight': {
    	'distance': 15,
    	'width': Math.PI / 3 
    }
}

aggressiveDriver = new Driver('tom');

aggressiveDriver.act = function(attribute, context) {
    return [Vector("NORTH", 2),
            Attack(attribute.attack, Vector("WEST", 1))];
}

aggressiveDriver.onAttack = function(hurt) {
    console.log('holy shit');
}

exports.aggressiveRobot = new Robot(attributeAgressive, aggressiveDriver);
