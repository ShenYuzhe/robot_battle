/* Below defines common sense */

HALF_SQRT_TWO = Math.sqrt(2) / 2;

DIRECTIONS = {
    
    NORTH: { "name": "NORTH",
        "x": 0, "y": 1},

    EAST_NORTH: { "name": "EAST_NORTH",
        "x": HALF_SQRT_TWO, "y": HALF_SQRT_TWO},
    
    EAST: { "name": "EAST",
        "x": 1, "y": 0},
    
    EAST_SOUTH: { "name": "EAST_SOUTH",
        "x": HALF_SQRT_TWO, "y": -HALF_SQRT_TWO},

    SOUTH: { "name": "SOUTH",
        "x": 0, "y": -1},

    WEST_SOUTH: { "name": "WEST_SOUTH",
        "x": -HALF_SQRT_TWO, "y": -HALF_SQRT_TWO},
    
    WEST: { "name": "WEST",
        "x": -1, "y": 0},

    WEST_NORTH: { "name": "WEST_NORTH",
        "x": -HALF_SQRT_TWO, "y": HALF_SQRT_TWO}

};
exports.DIRECTIONS = DIRECTIONS;

DIRECTION_ORDER = [
    'NORTH', 'EAST_NORTH', 'EAST', 'EAST_SOUTH',
    'SOUTH', 'WEST_SOUTH', 'WEST', 'WEST_NORTH'
];

Point = function(x, y) {

    return {
        'x': x,
        'y': y
    };
}
exports.Point = Point;

/* Below defines items submited by robot to playground*/

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

    vector.direction = direction;
    vector.distance = units;
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

Rotate = function(isClockwise, step) {

    var rotate = Action();

    rotate.name = 'ROTATE';
    rotate.isClockwise = isClockwise;
    rotate.step = step;

    return rotate;
}
exports.Rotate = Rotate;

rotateVector = function(vector, rotate) {

    var itStep = rotate.isClockwise ? 1 : -1,
        dirIdx = 0, rotateVec = vector;

    for (dirIdx = 0; dirIdx < DIRECTION_ORDER.length
        && DIRECTION_ORDER[dirIdx] != vector.direction; dirIdx++);

    for (i = 0; i < rotate.step; i++) {
        dirIdx = (dirIdx + DIRECTION_ORDER.length + itStep) % DIRECTION_ORDER.length;
        rotateVec = Vector(DIRECTION_ORDER[dirIdx], vector.distance);
    }
    return rotateVec;
}
exports.rotateVector = rotateVector;


/* Below defines items provided by playground to robot */
Item = function(type, vector) {

    return {
        'type': type,
        'vector': vector
    };
}

RobotItem = function(vector) {

    return Item('robot', vector);
}


SightBuilder = function() {

    var items = [];

    SightBuilder.prototype.withItem = function(item) {
        items[items.length] = item;
    }

    SightBuilder.prototype.build = function() {
        return {
            'items': items
        };
    }

}
exports.SightBuilder = SightBuilder();


