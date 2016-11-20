//var aggressiveRobot = require('./models/aggressive').aggressiveRobot;
//var strongRobot = require('./models/strong').strongRobot;
var geometry = require('../utils/geometry');
var data_struct = require('../utils/data_struct');
var Board = geometry.Board;
var calDistance = geometry.calDistance;
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

ContextBuilder.prototype.build = function() {

    return {
        'board_shape': this.shape,
        'items': this.items,
        'hurt': this.hurt
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
        var oldLoc = robot.getLocation();
        if (oldLoc != undefined)
            delete this.board[oldLoc.y][oldLoc.x].item;
        this.board[loc.y][loc.x].item = robot;
    }

    Playground.prototype.moveRobot = function(robot, loc) {

        this.moveOnBoard(robot, loc);
        robot.setLocation(loc);
        
    }

    Playground.prototype.updateSight = function(robot) {

        var view = [];

        scanSector(robot.sight, robot.loc, this.board, function(e) {
            if (e.item != undefined)
                view.push(e.item);
        });
        return view;
    }

    Playground.prototype.initRobotsLoc = function() {
        
        var sz = size(this.board);
        var x = sz[0], y = sz[1];
        var robotY = Math.floor(y / 2),
            xL = Math.floor(x / 3), xR = Math.floor(2 * x / 3);
        var initL = Point(xL, robotY), initR = Point(xR, robotY);
        this.moveRobot(this.robotL, initL);
        this.moveRobot(this.robotR, initR);

        this.robotL.setSight(Vector(Point(0, 0), Point(1, 0)));
        this.robotR.setSight(Vector(Point(0, 0), Point(-1, 0)));
    }

    Playground.prototype.executeAct = function(summaryL, summaryR) {
        var distance = calDistance(this.robotL.getLocation(),
            this.robotR.getLocation());
        //if (distance <= this.robotL.attribute.arm)
            this.robotR.onAttack(summaryL.attack);
        //if (distance <= this.robotR.attribute.arm)
            this.robotL.onAttack(summaryR.attack);
    }

    Playground.prototype.fight = function(robotL, robotR) {

        while(this.robotL.isAlive() && this.robotR.isAlive()) {
            var viewL = this.updateSight(this.robotL),
                viewR = this.updateSight(this.robotR);
            var contextL = new ContextBuilder()
                            .withItems(viewL)
                            .withShape(this.shape)
                            .build(),
                contextR = new ContextBuilder()
                            .withItems(viewR)
                            .withShape(this.shape)
                            .build();
            var actSummaryL = this.robotL.onAct(contextL),
                actSummaryR = this.robotR.onAct(contextR);

            this.executeAct(actSummaryL, actSummaryR);

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
        playground.initBoard(this.grid);
        playground.initRobot(this.robotLhs, this.robotRhs);
        return playground;
    }
}
exports.PlaygroundBuilder = PlaygroundBuilder;

/*var playground = new PlaygroundBuilder()
    .withGrid(100, 100).withRobots(aggressiveRobot, strongRobot).build();

playground.fight();*/

