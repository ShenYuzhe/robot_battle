var assert = require('assert');

function Queue() {

	this.q = [];
	Queue.prototype.doPeek = function() {
		return this.q[0];
	}

	Queue.prototype.isEmpty = function() {
		return this.q.length == 0;
	}

	Queue.prototype.push = function(item) {
		this.q.push(item)
	}

	Queue.prototype.pop = function() {
		var item = this.doPeek();
		this.q.shift();
		return item;
	}

	Queue.prototype.peek = function() {
		return this.doPeek();
	}
}
exports.Queue = Queue;

/* m: the rows of the array
 * n: the columns of the array
 * item: the filling element of the matrix
 * 		 it can be simply value
 *       or a callback function with following format:
 *       function(i, j) where i => rowId, j => colId
 */
function Array2D(m, n, item) {
	var callback = typeof(item) == 'function' ? item : (v, i) => item;
	return Array.apply(null, Array(m)).map(
		(vi, i) => Array.apply(null, Array(n)).map(
			(vj, j) => callback(i, j)));
}
exports.Array2D = Array2D;

/*
 * This method only guarantee rectangular array
 */
function size(arr) {
	var m = arr.length,
		n = 0;
	if (m > 0)
		n = arr[0].length;
	return [m, n];
}
exports.size = size;

/*
 * only checks the existence
 * of fields between two Jsons
 */
function checkJsonFields(tar, src) {
	assert.equal(typeof(tar), typeof(src));
	if ('object' != typeof(tar))
		return true;
	for (key in src)
		if (! src in tar)
			return false;
		else if ('object' == typeof(src[key])
			&& !checkJsonFields(tar[key], src[key]))
			return false;	
	return true;
}
exports.checkJsonFields = checkJsonFields;
