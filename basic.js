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

Vector = function(direction, units) {

    if (!(direction in DIRECTIONS))
        throw "invalid direction";
    
    // for playground verification
    this.distance = units * DIRECTIONS[direction].unit;
    // for robot location setting
    this.x = units * DIRECTIONS[direction].x;
    this.y = units * DIRECTIONS[direction].y
}

exports.Vector = Vector;

Attack = function(strike, vector) {
    this.strike = strike;
    this.vector = vector;
};

exports.Attack = Attack;

Defense = function(strength, vector) {
    this.strength = strength;  
    this.vector = vector;
}

exports.Defense = Defense;

exports.ACTIONS = {

    "MOVE": Vector,
    "ATTACK": Attack,
    "DEFENSE": Defense
};

exports.createAction = function(name, body) {
    return {"name": name, "body": body};
}
