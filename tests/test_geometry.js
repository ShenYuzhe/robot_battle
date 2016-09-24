geometry = require('../utils/geometry');
math_tools = require('../utils/math_tools');
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
assert.deepEqual(Sector(vec, Math.PI / 3),
	{'radius': 1, 'start': 5 * Math.PI / 6, 'end': Math.PI / 6});

// operations on data structure
degree2Rad = geometry.degree2Rad;
rad2Degree = geometry.rad2Degree;
degree2Rad = geometry.degree2Rad;
rad2Degree = geometry.rad2Degree;

calDistance = geometry.calDistance;
dotProduct = geometry.dotProduct;

rotateVector = geometry.rotateVector;
rotateVectorByDegree = geometry.rotateVectorByDegree;

scanSector = geometry.scanSector;
