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

Array2D = function(m, n, item) {
	var callback = typeof(item) == 'function' ? item : (v, i) => item;
	return Array.apply(null, Array(m)).map(
		(vi, i) => Array.apply(null, Array(n)).map(
			(vj, j) => callback(i, j)));
}
exports.Array2D = Array2D;