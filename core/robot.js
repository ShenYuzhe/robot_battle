basic = require('./basic');
geometry = require('../utils/geometry');

Point = geometry.Point;
calDistance = geometry.calDistance;
Vector = geometry.Vector;
zoomVec = geometry.zoomVec;
Sector = geometry.Sector;
rotateSectorByDegree = geometry.rotateSectorByDegree;


// definition for action
Driver = function(name) {
    
    this.name = name;

}

Driver.prototype.onAttack = function(hurt) {
    console.log(this.name + ": I am hurt by " + hurt);
}

Driver.prototype.act = function(attribute) {
    return [];
}

exports.Driver = Driver;


// Interacting Summary
ActSummaryBuilder = function() {}

ActSummaryBuilder.prototype.withSight = function(sight) {
    this.sight = sight;
    return this;
}

ActSummaryBuilder.prototype.withAttack = function(attack) {
    this.attack = attack;
    return this;
}

ActSummaryBuilder.prototype.withDefense = function(defense) {
    this.defense = defense;
    return this;
}


ActSummaryBuilder.prototype.withLocation = function(loc) {
    this.loc = loc;
    return this;
}

ActSummaryBuilder.prototype.build = function() {

    return {
        'sight': this.sight,
        'attack': this.attack,
        'defense': this.defense,
        'location': this.loc,
    };

}

// Basic robot definition
Robot = function(attribute, driver) {

    this.attribute = attribute;
    this.driver = driver;
}

Robot.prototype.setLocation = function(point) {
    this.loc = point;
}

Robot.prototype.getLocation = function() {
    return this.loc;
}

/* the vector set by the playground is 
 * defined to be normalized
 */
Robot.prototype.setSight = function(vec) {
    sightBase = zoomVec(vec, this.attribute.sight.distance);
    this.sight = Sector(sightBase, this.attribute.sight.width);
}

Robot.prototype.roundInit =function() {

    this.charge = this.attribute.energy;
    this.roundAttack = 0;
    this.roundDefense = 0;
}

Robot.prototype.onAttack = function(hurt) {
    if ('onAttack' in this.driver)
        this.driver.onAttack(hurt);    
    this.attribute.health -= (hurt - this.roundDefense);
} 

Robot.prototype.onAct = function(context) {
    this.roundInit();

    var actionList = this.driver.act(this.attribute, context);
    this.executeActList(actionList);
    return new ActSummaryBuilder()
        .withAttack(this.roundAttack)
        .withDefense(this.roundDefense)
        .withLocation(this.loc)
        .withSight(this.sight)
        .build();
}

Robot.prototype.getName = function() {
    return this.driver.name;
}

Robot.prototype.isAlive = function() {
    return this.attribute.health > 0;
}

Robot.prototype.move = function(point) {

    if (calDistance(this.loc, point) > this.attribute.reach)
        return;
    this.loc.x = point.x;
    this.loc.y = point.y;
}

Robot.prototype.rotate = function(degree, isClockwise) {
    rotateSectorByDegree(this.sight, degree, isClockwise);
}

Robot.prototype.consume = function(cost) {
    this.charge -= cost;
    return (this.charge >= 0);
}

Robot.prototype.ActTable = {

    'MOVE': {
        'verify': function(robot, action) {
            return calDistance(robot.loc, action.point) <= robot.attribute.reach;
        },
        'act': function(robot, action) {
            robot.loc = action.point;
        }
    },

    'ATTACK': {
        'verify': function(robot, action) {
            return action.strike <= robot.attribute.attack;
        },
        'act': function(robot, action) {
            robot.roundAttack += action.strike;
        }
    },

    'DEFENSE': {
        'verify': function(robot, action) {
            return action.strength <= robot.attribute.strength;
        },
        'act': function(robot, action) {
            robot.roundDefense += action.attribute.strength;
        }
    },

    'ROTATE': {
        'verify': function(robot, action) {
            return action.degree <= robot.attribute.rotate;
        },
        'act': function(robot, action) {
            rotateSectorByDegree(robot.sight, action.degree, action.isClockwise);
        }
    }
}

Robot.prototype.executeActList = function(actionList) {
    var action, actEntry;
    for (i in actionList) {
        action = actionList[i];
        if (!this.consume(action.cost))
            return;
        actEntry = this.ActTable[action.name];
        if (actEntry.verify(this, action))
            actEntry.act(this, action);
    }
}

exports.Robot = Robot;

































