Queue = function() {

	this.q = [];
	var doPeek = function() {
		return q[0];
	}

	Queue.prototype.isEmpty = function() {
		return q.length == 0;
	}

	Queue.prototype.push = function(item) {
		q.push(item)
	}

	Queue.prototype.pop = function() {
		var item = doPeek();
		q.shift();
		return item;
	}

	Queue.prototype.peek = function() {
		return doPeek();
	}
}