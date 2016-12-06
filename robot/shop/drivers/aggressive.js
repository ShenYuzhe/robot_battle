var libs = require('../../libs').collect;
var RobotModel = libs.robot;
Robot = RobotModel.Robot;
Driver = RobotModel.Driver;
basic = libs.basic;
data_struct = libs.data_struct;

aggressiveDriver = new Driver('tom');


Move = basic.Move;
Attack = basic.Attack;
Defense = basic.Defense;

Point = geometry.Point;
PolarVector = geometry.PolarVector;
calVecPoint = geometry.calVecPoint;
calVectorDegree = geometry.calVectorDegree;
rad2Degree = geometry.rad2Degree;
Vector = geometry.Vector;
zoomVec = geometry.zoomVec;

aggressiveDriver.act = function(attribute, context) {
    var items = context.items,
        loc = context.loc, sight = context.sight;
    var enemy = items.pop();
    var actList = [];
    if (undefined == enemy) {
        //console.log('cannot see with sight:', sight);
        if (undefined == this.roundOdd || this.roundOdd) {
            var tarPt = calVecPoint(loc, PolarVector(rad2Degree(sight.base) + 80, attribute.reach));
            
            this.roundOdd = false;
            return [Move(tarPt), Rotate(10, true)];
        }
        this.roundOdd = true;
        var tarPt = calVecPoint(loc, PolarVector(rad2Degree(sight.base) - 80, attribute.reach));
        return [Move(tarPt)];
    }
    var dashVec = Vector(loc, enemy.loc);
    if (dashVec.magnitude < attribute.arm) {
        var tarDegree = calVectorDegree(dashVec);
        console.log(tarDegree, rad2Degree(sight.base));
        return [Rotate(tarDegree - rad2Degree(sight.base), false), Attack(attribute.attack)];
    }
    dashVec = zoomVec(dashVec, (attribute.arm / 2) / dashVec.magnitude);

    if (loc.x == enemy.loc.x && loc.y == enemy.loc.y)
    if (dashVec.magnitude > attribute.reach)
        dashVec = zoomVec(attribute.reach / 2 / dashVec.magnitude);
    return [Move(calVecPoint(loc, dashVec))];
    i/*if (this.rotated == undefined) {
        this.rotated = true;
        return [Rotate(90, false)];
    }
    return [];*/
}

aggressiveDriver.onAttack = function(hurt) {
    console.log('holy shit');
}

exports.driver = aggressiveDriver;
