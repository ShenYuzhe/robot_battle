var data_struct = require('./data_struct');
var Queue = data_struct.Queue;

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
		,Point(vec.x / vec.magnitude, vec.y / vec.magnitude));
}

arcsin = function(vec) {

	var rad = Math.asin(vec.y);
	return [rad, Math.PI - rad];
}

arccos = function(vec) {

	var rad = Math.acos(vec.x);
	return [rad, -rad];
}

/* to be considered */
MAX_DIGITS = 10;

Number.prototype.isEqual = function(number, digits){
	digits = digits == undefined? 10: digits; // 默认精度为10
	return this.toFixed(digits) === number.toFixed(digits);
}

calArc = function(vec) {
	var normVec = normalize(vec);
	var sinArchs = arcsin(normVec), cosArchs = arccos(normVec);
	console.log(sinArchs);
	console.log(cosArchs);
	for (i in sinArchs)
		for ( j in cosArchs)
			if (sinArchs[i].isEqual(cosArchs[j], MAX_DIGITS))
				return sinArchs[i];
		
	return 0;
}
exports.calArc = calArc;

Sector = function(vec, width) {

	var baseArch = calArch(vec);
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

scanSector = function(sector, point, board, callback) {

	var q = new Queue();
	q.push(point);

	while (!q.empty()) {

		curr = q.pop();
		if (board.covered(curr) == true)
			continue;
		board.mark(curr);

		if (curr.x < 0 || curr.x > board.x
			|| curr.y < 0 || curr.y > board.y)
			continue;

		if (calDistance(curr, point) > sector.radius)
			continue;

		var currArch = calArc(),
			adjustArch = currArch + 2 * Math.PI;

		if (!(sector.start >= currArch && currArch >= sector.end)
			&& !(sector.start >= adjustArch && adjustArch >= sector.end))
			continue;

		callback(curr);

		q.push(Point(curr.x - 1, curr.y - 1));
		q.push(Point(curr.x + 1, curr.y - 1));
		q.push(Point(curr.x + 1, curr.y + 1));
		q.push(Point(curr.x - 1, curr.y + 1));
	}
}
exports.scanSector = scanSector();






























