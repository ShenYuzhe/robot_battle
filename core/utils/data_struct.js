Queue = function() {

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
Array2D = function(m, n, item) {
	var callback = typeof(item) == 'function' ? item : (v, i) => item;
	return Array.apply(null, Array(m)).map(
		(vi, i) => Array.apply(null, Array(n)).map(
			(vj, j) => callback(i, j)));
}
exports.Array2D = Array2D;

/*
 * This method only guarantee rectangular array
 */
size = function(arr) {
	var m = arr.length,
		n = 0;
	if (m > 0)
		n = arr[0].length;
	return [m, n];
}
exports.size = size;