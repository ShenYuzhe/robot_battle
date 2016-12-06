/* Below defines common sense */

ACTION_COST_UNIT = 1;
exports.ACTION_COST_UNIT = ACTION_COST_UNIT;

function Action() {

    return {
        'name': 'Action',
        'cost': ACTION_COST_UNIT
    }
    
}

Move = function(point) {
    var move = Action();
    move.point = point;
    move.name = 'MOVE';
    return move;
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

function addRotation(rotations) {
    
    var res = Rotate(0);
    for (i in arguments)
        if (undefined == arguments[i])
            continue;
        else if (arguments[i].isClockwise)
            res.degree += arguments[i].degree;
        else
            res.degree -= arguments[i].degree;
    if (res.degree < 0)
        res.isClockwise = false;
    return res;
}
exports.addRotation = addRotation;

/* Below defines items provided by playground to robot */
Item = function(type, vector) {

    return {
        'type': type
    };
}
exports.Item = Item;



