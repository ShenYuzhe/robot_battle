var geometry = require('../utils/geometry');
var data_struct = require('../utils/data_struct');
var Board = geometry.Board;
var calDistance = geometry.calDistance;
var scanSector = geometry.scanSector;
var size = data_struct.size;


ContextBuilder = function() {}

ContextBuilder.prototype.withItems = function(items) {
    this.items = items;
    return this;
}

ContextBuilder.prototype.withHurt = function(hurt) {
    this.hurt = hurt;
    return this;
}

ContextBuilder.prototype.withShape = function(shape) {
    this.shape = shape;
    return this;
}

ContextBuilder.prototype.withLocation = function(loc) {
    this.loc = loc;
    return  this;
}

ContextBuilder.prototype.withSight = function(sight) {
    this.sight = sight;
    return this;
}

ContextBuilder.prototype.build = function() {

    return {
        'shape': this.shape,
        'items': this.items,
        'hurt': this.hurt,
        'loc': this.loc,
        'sight': this.sight
    };
}

RoundReportBuilder = function() {}

RoundReportBuilder.prototype.withLeftRobot = function(leftRobot) {
    this.leftRobot = leftRobot;
    return this;
}

RoundReportBuilder.prototype.withRightRobot = function(rightRobot) {
    this.rightRobot = rightRobot;
    return this;
}

RoundReportBuilder.prototype.build = function() {
    return {
        'left_robot': this.leftRobot,
        'right_robot': this.rightRobot
    };
}

RobotReportBuilder = function() {}

RobotReportBuilder.prototype.withHealth = function(health) {
    this.health = health;
    return this;
}

RobotReportBuilder.prototype.withPosition = function(position) {
    this.position = position;
    return this;
}

RobotReportBuilder.prototype.withDirection = function(direction) {
    this.direction = direction;
    return this;
}

RobotReportBuilder.prototype.withAttack = function(attack) {
    this.attack = attack;
    return this;
}

RobotReportBuilder.prototype.withDefense = function(defense) {
    this.defense = defense;
    return this;
}

RobotReportBuilder.prototype.build = function() {
    return {
        'health': this.health,
        'direction': this.direction,
        'position': this.position,
        'attack': this.attack,
        'defense': this.defense
    };
}

function PlaygroundBuilder() {


    var Playground = function(height, width) {}

    Playground.prototype.initBoard = function(shape) {
        this.shape = shape;
        this.board = Board(shape.height, shape.width);
    }

    Playground.prototype.initRobot = function(robotL, robotR) {
        this.robotL = robotL;
        this.robotR = robotR;
        this.initRobotsLoc();
    }

    Playground.prototype.moveOnBoard = function(robot, loc) {
        var prevLoc = robot.prevLoc;
        if (undefined != prevLoc)
            delete this.board[prevLoc.y][prevLoc.x].item;
        this.board[loc.y][loc.x].item = robot;
    }

    Playground.prototype.moveRobot = function(robot, loc) {

        this.moveOnBoard(robot, loc);
        robot.setLocation(loc);
        
    }

    Playground.prototype.updateSight = function(robot) {

        var view = [];

        scanSector(robot.sight, robot.loc, this.board, function(e) {
            if (undefined != e.item 
                && !( e.x == robot.loc.x && e.y == robot.loc.y))
                view.push(e.item);
        });

        return view;
    }

    Playground.prototype.initRobotsLoc = function() {
        
        var sz = size(this.board);
        var x = sz[0], y = sz[1];
        var robotY = Math.floor(y / 2),
            xL = Math.floor(x * 2 / 3), xR = Math.floor(3 * x / 4);
        var initL = Point(xL, robotY), initR = Point(xR, robotY);
        this.moveRobot(this.robotL, initL);
        this.moveRobot(this.robotR, initR);

        this.robotL.setSight(Vector(Point(0, 0), Point(1, 0)));
        this.robotR.setSight(Vector(Point(0, 0), Point(-1, 0)));
    }

    Playground.prototype.executeAct = function(summaryL, summaryR) {
        this.moveRobot(this.robotL, this.robotL.loc);
        this.moveRobot(this.robotR, this.robotR.loc);
        var distance = calDistance(this.robotL.getLocation(),
            this.robotR.getLocation());
        //if (distance <= this.robotL.attribute.arm)
            this.robotR.onAttack(summaryL.attack);
        //if (distance <= this.robotR.attribute.arm)
            this.robotL.onAttack(summaryR.attack);
    }

    Playground.prototype.fight = function(callback) {

        while(this.robotL.isAlive() && this.robotR.isAlive()) {
            var viewL = this.updateSight(this.robotL),
                viewR = this.updateSight(this.robotR);

            //this.board[50][75].covered = false;
            //this.board[50][66].covered = false;

            //console.log(this.board[50][75]);

            var contextL = new ContextBuilder()
                            .withItems(viewL)
                            .withShape(this.shape)
                            .withLocation(this.robotL.loc)
                            .withSight(this.robotL.sight)
                            .build(),
                contextR = new ContextBuilder()
                            .withItems(viewR)
                            .withShape(this.shape)
                            .withLocation(this.robotR.loc)
                            .withSight(this.robotR)
                            .build();
            var actSummaryL = this.robotL.onAct(contextL),
                actSummaryR = this.robotR.onAct(contextR);

            this.executeAct(actSummaryL, actSummaryR);
            
            var leftRobotReport = new RobotReportBuilder()
                                    .withHealth(this.robotL.getHealth())
                                    .withPosition(this.robotL.loc)
                                    .withDirection(this.robotL.getDirection())
                                    .withAttack(actSummaryL.attack)
                                    .withDefense(actSummaryL.defense).build(),
                rightRobotReport = new RobotReportBuilder()
                                    .withHealth(this.robotR.getHealth())
                                    .withPosition(this.robotR.loc)
                                    .withDirection(this.robotR.getDirection())
                                    .withAttack(actSummaryR.attack)
                                    .withDefense(actSummaryR.defense).build();
            var roundReport = new RoundReportBuilder()
                                .withLeftRobot(leftRobotReport)
                                .withRightRobot(rightRobotReport)
                                .build();
            callback(roundReport);
        }
        if(this.robotL.isAlive())
            return this.robotL.getName();

        if (this.robotR.isAlive())
            return this.robotR.getName();

        return 'nobody';
    }

    PlaygroundBuilder.prototype.withGrid = function(h, w) {
        this.grid = {'height': h, 'width': w};
        return this;
    }

    PlaygroundBuilder.prototype.withRobots = function(robotLhs, robotRhs) {
        this.robotLhs = robotLhs;
        this.robotRhs = robotRhs;
        return this;
    }

    PlaygroundBuilder.prototype.build = function() {
        var playground = new Playground();
        //console.log(this.grid);
        playground.initBoard(this.grid);
        playground.initRobot(this.robotLhs, this.robotRhs);
        return playground;
    }
}
exports.PlaygroundBuilder = PlaygroundBuilder;

/*var playground = new PlaygroundBuilder()
    .withGrid(100, 100).withRobots(aggressiveRobot, strongRobot).build();

playground.fight();*/

