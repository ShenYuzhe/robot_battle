/* Below defines common sense */

ACTION_COST_UNIT = 1;
exports.ACTION_COST_UNIT = ACTION_COST_UNIT;

function Action() {

    return {
        'name': 'Action',
        'cost': ACTION_COST_UNIT
    }
    
}

Move = function(Point p) {
    var move = Action();
    move.point = p;
    move.name = 'MOVE';
    return p;
}
exports.Move = Move;

Attack = function(strike) {

    var attack = Action();

    attack.name = 'ATTACK';
    attack.strike = strike;

    return attack;
};
exports.Attack = Attack;

Defense = function(strength) {
    
    var defense = Action();

    defense.name = 'DEFENSE';
    defense.strength = strength;

    return defense;
}
exports.Defense = Defense;

Rotate = function(degree, isClockwise) {

    var rotate = Action();

    rotate.name = 'ROTATE';
    rotate.isClockwise = isClockwise == undefined ? true : isClockwise;
    rotate.degree = degree;

    return rotate;
}
exports.Rotate = Rotate;

/* Below defines items provided by playground to robot */
Item = function(type, vector) {

    return {
        'type': type
    };
}
exports.Item = Item;



