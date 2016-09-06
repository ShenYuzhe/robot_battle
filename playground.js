var aggressiveRobot = require('./models/aggressive').aggressiveRobot;
var strongRobot = require('./models/strong').strongRobot;

PlaygroundBuilder = function() {

    var calculateRound = function(actionList, robot) {
        
        var totalAttack = 0;
        for (i in actionList)
            if (actionList[i].name == "MOVE")
                robot.move(actionList[i].body);
            else if (actionList[i].name == "ATTACK")
                totalAttack += actionList[i].body.strike;

        return totalAttack;
                
    }

    var Playground = function(height, width) {
        
        this.fight = function() {
            while (this.robotLhs.isAlive() && this.robotRhs.isAlive()) {
                var actsLhs = this.robotLhs.onAct(),
                    actsRhs = this.robotRhs.onAct();
                
                console.log(this.robotLhs.getName() + " is at ");
                console.log(this.robotLhs.loc);

                console.log(this.robotRhs.getName() + " is at ");
                console.log(this.robotRhs.loc);

                var hurtL = calculateRound(actsLhs, this.robotLhs),
                    hurtR = calculateRound(actsRhs, this.robotRhs);
                
                this.robotLhs.onAttack(hurtR);
                this.robotRhs.onAttack(hurtL);
            }

            if (this.robotLhs.isAlive())
                console.log(this.robotLhs.getName() + " wins");
            else if (this.robotRhs.isAlive())
                console.log(this.robotRhs.getName() + " wins");
            else
                console.log("tie game");

        }
    }
    
    this.withGrid = function(h, w) {
        this.grid = {'height': h, 'weight': w};
        return this;
    }

    this.withRobots = function(robotLhs, robotRhs) {
        this.robotLhs = robotLhs;
        this.robotRhs = robotRhs;
        return this;
    }

    this.build = function() {
        var playground = new Playground();
        playground.grid = this.grid;
        playground.robotLhs = this.robotLhs;
        playground.robotRhs = this.robotRhs;
        return playground;
    }
}

var playground = new PlaygroundBuilder()
    .withGrid(100, 100).withRobots(aggressiveRobot, strongRobot).build();

playground.fight();

