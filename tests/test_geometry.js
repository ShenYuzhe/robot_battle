geometry = require('../utils/geometry');
//math_tools = require('../utils/math_tools');
const assert = require('assert');


// data structures
Point = geometry.Point;
Vector = geometry.Vector;
Sector = geometry.Sector;

assert.deepEqual(Point(2, 3), {'x': 2, 'y': 3});
console.log("create point case pass");

p1 = Point(1, 1);
p2 = Point(4, 5);
assert.deepEqual(Vector(p1, p2), {'x': 3, 'y': 4, 'magnitude': 5});
console.log("create vector case pass");


vec = Vector(Point(0, 0), Point(0, 1));
sec = Sector(vec, Math.PI / 3);
sec_res = {'radius': 1, 'start': 5 * Math.PI / 6, 'end': Math.PI / 6};
for (key in sec)
	assert(sec[key].simEq(sec_res[key]));
console.log("create sector passes");

// operations on data structure
degree2Rad = geometry.degree2Rad;
rad2Degree = geometry.rad2Degree;

calDistance = geometry.calDistance;
dotProduct = geometry.dotProduct;

assert.equal(calDistance(p1, p2), 5);
console.log("calculate distance test passes");

vec1 = Vector(Point(0, 0), Point(0, 1));
vec2 = Vector(Point(0, 0), Point(3, 4));
assert.equal(dotProduct(vec, vec2), 4);
console.log("calculate dot product test passes");

rotateVector = geometry.rotateVector;
rotateVectorByDegree = geometry.rotateVectorByDegree;

function testRotate(vec, vecR, rad, isClockwise) {
	rotateVector(vec, rad, isClockwise);
	for (key in vec)
		assert(vec[key].simEq(vecR[key]));
}

var vec = Vector(Point(0, 0), Point(1, 0));
var vecRes = Vector(Point(0, 0), Point(0, 1));
testRotate(vec, vecRes, Math.PI / 2, false);
console.log("rotate unclockwise 90 degree passes");
vecRes = Vector(Point(0, 0), Point(1, 0));
testRotate(vec, vecRes, Math.PI / 2, true);
console.log("rotate clockwise 90 degree passes");
vecRes = Vector(Point(0, 0), Point(0, -1));
testRotate(vec, vecRes, Math.PI / 2, true);
console.log("rotate clockwise 90 degree passes");
vecRes = Vector(Point(0, 0), Point(-1, -0));
testRotate(vec, vecRes, Math.PI / 2, true);
console.log("rotate clockwise 90 degree passes");
vecRes = Vector(Point(0, 0), Point(0, 1));
testRotate(vec, vecRes, Math.PI / 2, true);
console.log("rotate clockwise 90 degree passes");

Board = geometry.Board;
scanSector = geometry.scanSector;

board = Board(2, 2, Point);
assert.deepEqual(board,
	[[Point(0, 0), Point(0, 1)],
	 [Point(1, 0), Point(1, 1)]]);
console.log("create board test passes");

board = Board(10, 10);
vector = Vector(Point(0, 0), Point(3, 0));
sector = Sector(vector, Math.PI / 4);

scanSector(sector, Point(2, 2), board,
	function(p) {
		console.log(p);
	});





