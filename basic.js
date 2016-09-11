syntaxtend = require('./utils/syntaxtend');
inherit = syntaxtend.inherit;

DIRECTIONS = {
    
    NORTH: { "name": "NORTH",
        "unit": 1, "x": 0, "y": 1},

    EAST_NORTH: { "name": "EAST_NORTH",
        "unit": Math.sqrt(2), "x": 1, "y": 1},
    
    EAST: { "name": "EAST",
        "unit": 1, "x": 1, "y": 0},
    
    EAST_SOUTH: { "name": "EAST_SOUTH",
        "unit": Math.sqrt(2), "x": 1, "y": -1},

    SOUTH: { "name": "SOUTH",
        "unit": 1, "x": 0, "y": -1},

    WEST_SOUTH: { "name": "WEST_SOUTH",
        "unit": Math.sqrt(2), "x": -1, "y": -1},
    
    WEST: { "name": "WEST",
        "unit": 1, "x": -1, "y": 0},

    WEST_NORT: { "name": "WEST_NORTH",
        "unit": Math.sqrt(2), "x": -1, "y": 1}

};
exports.DIRECTIONS = DIRECTIONS;


ACTION_COST_UNIT = 1;
exports.ACTION_COST_UNIT = ACTION_COST_UNIT;

Action = function() {
    Action.prototype.cost = ACTION_COST_UNIT;
}

Vector = function(direction, units) {
    inherit(new Action(), this);

    if (!(direction in DIRECTIONS))
        throw "invalid direction";
    
    // for playground verification
    this.distance = units * DIRECTIONS[direction].unit;
    // for robot location setting
    this.x = units * DIRECTIONS[direction].x;
    this.y = units * DIRECTIONS[direction].y

    this.cost = ACTION_COST_UNIT * 2;
}
exports.Vector = Vector;

Attack = function(strike, vector) {
    inherit(new Action(), this);

    this.strike = strike;
    this.vector = vector;
};
exports.Attack = Attack;

Defense = function(strength, vector) {
    console.log("construct defense");
    inherit(new Action(), this);

    this.strength = strength;  
    this.vector = vector;
}

exports.Defense = Defense;

ACTIONS = {

    "MOVE": Vector,
    "ATTACK": Attack,
    "DEFENSE": Defense
};
exports.ACTIONS = ACTIONS;

exports.createAction = function(name, body) {
    return {"name": name, "body": body};
}






