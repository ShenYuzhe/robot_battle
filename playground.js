var aggressiveRobot = require('./models/aggressive').aggressiveRobot;
var strongRobot = require('./models/strong').strongRobot;
var geometry = require('./utils/geometry');
var Board = geometry.Board;
var size = geometry.size;

Context = function(items, boardInfo) {

    return {
        'items': items,
        'boardInfo': boardInfo;
    };
}

ContextBuilder = function() {}

ContextBuilder.prototype.withItems = function(items) {
    this.items = items;
}

ContextBuilder.prototype.withHurt = function(hurt) {
    this.hurt = hurt;
}

ContextBuilder.prototype.build = function() {

    return {
        'items': this.items,
        'hurt': this.hurt
    };
}

PlaygroundBuilder = function() {


    var Playground = function(height, width) {

        this.board = Board(height, width);
    }

    Playground.prototype.moveOnBoard = function(robot, loc) {
        var oldLoc = robot.getLocation();
        delete this.board[oldLoc.y][oldLoc.x].item;
        this.board[loc.y][loc.x].item = robot;
    }

    Playground.prototype.moveRobot = function(robot, loc) {

        moveOnBoard(robot, loc);
        robot.setLocation(loc);
        
    }

    Playground.prototype.updateSight = function(robot) {

        var view = [];

        scanSector(robot.sight, robot.loc, this.board, function(e)) {
            if (e.item != undefined)
                view.push(e.item);
        }
        return view;
    }

    Playground.prototype.initRobotsLoc = function() {
        
        var sz = size(this.board);
        var x = sz[0], y = sz[1];
        var robotY = y / 2, xL = x / 3, xR = 2 * x / 3;
        var initL = Point(xL, robotY), initR = Point(xR, robotY);
        this.moveRobot(this.robotLhs, initL);
        this.moveRobot(this.robotRhs, initR);

        this.robotLhs.setSight(Vector(Point(0, 0), Point(1, 0)));
        this.robotRhs.setSight(Vector(Point(0, 0), Point(-1, 0)));
    }

    Playground.prototype.initRobotsLoc = function() {

        var sz = size(this.board);
        var x = sz[0], y = sz[1];
        var robotY = y / 2, xL = x / 3, xR = 2 * x / 3;
        var initL = Point(xL, robotY), initR = Point(xR, robotY);
        this.moveRobot(this.robotLhs, initL);
        this.moveRobot(this.robotRhs, initR);

        this.robotLhs.setSight(Vector(Point(0, 0), Point(1, 0)));
        this.robotRhs.setSight(Vector(Point(0, 0), Point(-1, 0)));
    }

    Playground.prototype.fight = function(robotL, robotR) {
        this.initRobotsLoc();

        while(robotL.isAlive() && robotR.isAlive()) {
            var viewL = this.updateSight(robotL),
                viewR = this.updateSight(robotR);
            var contextL = ContextBuilder()
                            .withItems(viewL);
                            .build(),
                contextR = ContextBuilder()
                            .withItems(viewR)
                            .build();
            var actSummaryL = robotL.onAct(contextL),
                actSummaryR = robotR.onAct(contextR);

            this.executeAct(actSummaryL, actSummaryR);

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

