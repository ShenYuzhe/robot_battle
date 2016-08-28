var aggressiveRobot = require('./models/aggressive').aggressiveRobot;
var strongRobot = require('./models/strong').strongRobot;

fight = function(robotLhs, robotRhs) {
    while (robotLhs.isAlive() && robotRhs.isAlive()) {
        var hurtL = robotLhs.onAct(),
            hurtR = robotRhs.onAct();
        robotLhs.onAttack(hurtR);
        robotRhs.onAttack(hurtL);
    }

    if (robotLhs.isAlive())
        console.log(robotLhs.getName() + " wins");
    else if (robotRhs.isAlive())
        console.log(robotRhs.getName() + " wins");
    else
        console.log("tie game");

}

fight(aggressiveRobot, strongRobot);
