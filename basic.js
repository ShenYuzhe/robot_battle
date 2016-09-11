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

function Action() {

    return {
        'name': 'Action',
        'cost': ACTION_COST_UNIT
    }
    
}

function Vector (direction, units) {

    if (!(direction in DIRECTIONS))
        throw 'invalid direction';
    
    var vector = Action();
    vector.name = 'VECTOR';
    vector.cost = ACTION_COST_UNIT * 2;

    vector.distance = units * DIRECTIONS[direction].unit;
    vector.x = units * DIRECTIONS[direction].x;
    vector.y = units * DIRECTIONS[direction].y

    return vector;
}
exports.Vector = Vector;

Attack = function(strike, vector) {

    var attack = Action();

    attack.name = 'ATTACK';
    attack.strike = strike;
    attack.vector = vector;

    return attack;
};
exports.Attack = Attack;

Defense = function(strength, vector) {
    
    var defense = Action();

    defense.name = 'DEFENSE';
    defense.strength = strength;  
    defense.vector = vector;

    return defense;
}
exports.Defense = Defense;





