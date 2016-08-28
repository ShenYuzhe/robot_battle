RobotModel = require('../robot');

Robot = RobotModel.Robot;
Action = RobotModel.Action;

// instance for agressive user
attributeAgressive = {
    'health': 300,
    'attack': 100
}

agressiveAction = new Action('tom');
agressiveAction.onAttack = function(hurt) {
    console.log('holy shit');
}

exports.aggressiveRobot = new Robot(attributeAgressive, agressiveAction);
