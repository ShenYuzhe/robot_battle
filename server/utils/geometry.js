var data_struct = require('./data_struct');
var Queue = data_struct.Queue;
var Array2D = data_struct.Array2D;
var math_tool = require('./math_tools');
const assert = require('assert');

function Point(x, y) {

	return {'x': x, 'y': y};

}
exports.Point = Point;

function calDistance(p1, p2) {
	return Math.sqrt(Math.pow(p1.x - p2.x, 2)
		+ Math.pow(p1.y - p2.y, 2));
}
exports.calDistance = calDistance;

/* vector definition */
function Vector(pFrom, pTo) {

	return {
		'x': pTo.x - pFrom.x,
		'y': pTo.y - pFrom.y,
		'magnitude': calDistance(pFrom, pTo) 

	};

}
exports.Vector = Vector;

function zoomVec(vec, multi) {

	return Vector(Point(0, 0),
		Point(vec.x * multi, vec.y * multi));
	
}
exports.zoomVec = zoomVec;

function dotProduct(vec1, vec2) {

	return vec1.x * vec2.x + vec1.y * vec2.y;

}
exports.dotProduct = dotProduct;

function degree2Rad(degree) {

	return degree * Math.PI / 180;
}
exports.degree2Rad = degree2Rad;

function rad2Degree(rad) {

	return rad * 180 / Math.PI;
}
exports.rad2Degree = rad2Degree;

function AntiClockwiseMatrix(rad) {

	return { 
		'x_vec': Vector(Point(0, 0),
			Point(Math.cos(rad), -Math.sin(rad))),
		'y_vec': Vector(Point(0, 0),
			Point(Math.sin(rad), Math.cos(rad)))	
	};

}

function ClosewiseMatrix(rad) {

	return AntiClockwiseMatrix(-rad);

}

function rotateVector(vector, rad, isClockwise) {
	isClockwise = isClockwise == undefined ? true : isClockwise;
	var rotateMatrix = isClockwise ? ClosewiseMatrix(rad) : AntiClockwiseMatrix(rad);
	var originVector = Vector(Point(0, 0),
		Point(vector.x, vector.y));

	vector.x = dotProduct(originVector, rotateMatrix.x_vec);
	vector.y = dotProduct(originVector, rotateMatrix.y_vec);

}
exports.rotateVector = rotateVector;

function rotateVectorByDegree(vector, degree, isClockwise) {
	rotateVector(vector, degree2Rad(degree), isClockwise);	
}
exports.rotateVectorByDegree = rotateVectorByDegree;


/* sector definition */
function normalize(vec) {
	
	return Vector(Point(0, 0),
		Point(vec.x / vec.magnitude, vec.y / vec.magnitude));
}

function arcsin(vec) {

	var rad = Math.asin(vec.y);
	return [rad, Math.PI - rad];
}

function arccos(vec) {

	var rad = Math.acos(vec.x);
	return [rad, -rad];
}

function calArc(vec) {
	var normVec = normalize(vec);
	var sinArchs = arcsin(normVec), cosArchs = arccos(normVec);
	for (i in sinArchs)
		for ( j in cosArchs)
			if (sinArchs[i].simEq(cosArchs[j]))
				return sinArchs[i];
		
	return 0;
}
exports.calArc = calArc;

/* board definition */
function Board(x, y, item) {
	assert(x > 0 && y > 0);
	if (item == undefined)
		item = function(i, j) {
			var p = Point(j, i);
			p.covered = false;
			return p;
		};

	return Array2D(y, x, item);
}
exports.Board = Board;

/* sector definition */
function Sector(vec, width) {

	var baseArch = calArc(vec);
	var start = baseArch + width,
		end = baseArch - width;

	if (start < end)
		start = start + 2 * Math.PI;

	return {
		'radius': vec.magnitude,
		'start': start,
		'end': end,
        'base': baseArch
	};

}
exports.Sector = Sector;

function rotateSector(sector, rad, isClockwise) {
	if (isClockwise == undefined)
		isClockwise = true;
	var coef = isClockwise ? -1 : 1;
	sector.start += coef * rad;
	sector.end += coef * rad;

	while (start > 2 * Math.PI) {
		sector.start -= 2 * Math.PI;
		sector.end -= 2 * Math.PI;
	}

	while (start < -Math.PI) { 
		sector.start += 2 * Math.PI;
		sector.end += 2 * Math.PI;
	}
}
exports.rotateSector = rotateSector;

function rotateSectorByDegree(sector, degree, isClockwise) {
	return rotateSector(sector, degree2Rad(degree), isClockwise);
}
exports.rotateSectorByDegree = rotateSectorByDegree;

function withinSector(sector, origin, point) {

	if (calDistance(origin, point) > sector.radius)
		return false;

	if (origin.x == point.x && origin.y == point.y)
		return true;

	var arc = calArc(Vector(origin, point)),
		adjustArc = arc + 2 * Math.PI;

	return (sector.start >= arc && arc >= sector.end)
		|| (sector.start >= adjustArc && adjustArc >= sector.end);
		//|| sector.start.simEq(arc, 3) || arc.simEq(sector.end, 3)
		//|| sector.start.simEq(adjustArc, 3) || adjustArc.simEq(sector.end, 3);
}


/*
 * callback is the function(<point on board>)
 */
function scanSector(sector, origin, board, callback) {
	var y = board.length;
	if (y == 0)
		return;
	var x = board[0].length;

	var q = new Queue();
	q.push(origin);

	while (!q.isEmpty()) {

		var curr = q.pop();
		if (curr.x < 0 || curr.x > x
			|| curr.y < 0 || curr.y > y)
			continue;

		if (board[curr.y][curr.x].covered == true)
			continue;
		board[curr.y][curr.x].covered = true;

		if (!withinSector(sector, origin, curr))
			continue;

		callback(board[curr.y][curr.x]);

		q.push(Point(curr.x - 1, curr.y));
		q.push(Point(curr.x + 1, curr.y));
		q.push(Point(curr.x, curr.y - 1));
		q.push(Point(curr.x, curr.y + 1));
	}
}
exports.scanSector = scanSector;
