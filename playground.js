var aggressiveRobot = require('./models/aggressive').aggressiveRobot;
var strongRobot = require('./models/strong').strongRobot;

PlaygroundBuilder = function() {

    var Playground = function(height, width) {
        var calculateRound = function(actionList, robot) {
            robot.recharge();
            var totalAttack = 0;
            for (i in actionList) {
                if (!robot.consume(actionList[i].cost))
                    break;
                if (actionList[i].name == 'VECTOR')
                    robot.move(actionList[i]);
                else if (actionList[i].name == 'ATTACK')
                    totalAttack += actionList[i].strike;
            }
            return totalAttack;
                    
        }
        
        Playground.prototype.fight = function() {
            while (this.robotLhs.isAlive() && this.robotRhs.isAlive()) {
                var actsLhs = this.robotLhs.onAct(),
                    actsRhs = this.robotRhs.onAct();
                
                console.log(this.robotLhs.getName() + ' is at ');
                console.log(this.robotLhs.loc);

                console.log(this.robotRhs.getName() + ' is at ');
                console.log(this.robotRhs.loc);

                var hurtL = calculateRound(actsLhs, this.robotLhs),
                    hurtR = calculateRound(actsRhs, this.robotRhs);
                
                this.robotLhs.onAttack(hurtR);
                this.robotRhs.onAttack(hurtL);
            }

            if (this.robotLhs.isAlive())
                console.log(this.robotLhs.getName() + ' wins');
            else if (this.robotRhs.isAlive())
                console.log(this.robotRhs.getName() + ' wins');
            else
                console.log('tie game');

        }
    }

    PlaygroundBuilder.prototype.withGrid = function(h, w) {
        this.grid = {'height': h, 'weight': w};
        return this;
    }

    PlaygroundBuilder.prototype.withRobots = function(robotLhs, robotRhs) {
        this.robotLhs = robotLhs;
        this.robotRhs = robotRhs;
        return this;
    }

    PlaygroundBuilder.prototype.build = function() {
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

