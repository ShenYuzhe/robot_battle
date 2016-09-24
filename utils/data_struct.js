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