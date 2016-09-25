var data_struct = require('./data_struct');
var math_tools = require('./math_tools');
var Queue = data_struct.Queue;
var Array2D = data_struct.Array2D;
const assert = require('assert');

Point = function(x, y) {

	return {'x': x, 'y': y};

}
exports.Point = Point;

calDistance = function(p1, p2) {
	return Math.sqrt(Math.pow(p1.x - p2.x, 2)
		+ Math.pow(p1.y - p2.y, 2));
}
exports.calDistance = calDistance;

/* vector definition */
Vector = function(pFrom, pTo) {

	return {
		'x': pTo.x - pFrom.x,
		'y': pTo.y - pFrom.y,
		'magnitude': calDistance(pFrom, pTo) 

	};

}
exports.Vector = Vector;

dotProduct = function(vec1, vec2) {

	return vec1.x * vec2.x + vec1.y * vec2.y;

}
exports.dotProduct = dotProduct;

degree2Rad = function(degree) {

	return degree * Math.PI / 180;
}
exports.degree2Rad = degree2Rad;

rad2Degree = function(rad) {

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

rotateVector = function(vector, rad, isClockwise) {
	isClockwise = isClockwise == undefined ? true : isClockwise;
	var rotateMatrix = isClockwise ? ClosewiseMatrix(rad) : AntiClockwiseMatrix(rad);
	var originVector = Vector(Point(0, 0),
		Point(vector.x, vector.y));

	vector.x = dotProduct(originVector, rotateMatrix.x_vec);
	vector.y = dotProduct(originVector, rotateMatrix.y_vec);

}
exports.rotateVector = rotateVector;

rotateVectorByDegree = function(vector, degree, isClockwise) {
	rotateVector(vector, degree2Rad(degree), isClockwise);	
}
exports.rotateVectorByDegree = rotateVectorByDegree;


/* sector definition */
normalize = function(vec) {
	
	return Vector(Point(0, 0),
		Point(vec.x / vec.magnitude, vec.y / vec.magnitude));
}

arcsin = function(vec) {

	var rad = Math.asin(vec.y);
	return [rad, Math.PI - rad];
}

arccos = function(vec) {

	var rad = Math.acos(vec.x);
	return [rad, -rad];
}

calArc = function(vec) {
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
Board = function(x, y, item) {
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
Sector = function(vec, width) {

	var baseArch = calArc(vec);
	var start = baseArch + width,
		end = baseArch - width;

	if (start < end)
		start = start + 2 * Math.PI;

	return {
		'radius': vec.magnitude,
		'start': start,
		'end': end
	};

}
exports.Sector = Sector;

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

scanSector = function(sector, origin, board, callback) {
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






























