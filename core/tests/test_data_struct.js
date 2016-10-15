data_struct = require('../utils/data_struct');
const assert = require('assert');
Queue = data_struct.Queue;

var queue = new Queue();
assert(queue.isEmpty());
console.log("empty test pass");

queue.push(4);
assert.equal(queue.peek(), 4);
console.log("push and peek test pass");

assert(!queue.isEmpty());
console.log("not empty test pass");

queue.push(5);
assert.equal(queue.peek(), 4)
console.log("push and peek test pass");

assert.equal(queue.pop(), 4);
console.log("pop test pass");

assert.equal(queue.peek(), 5);
assert.equal(queue.pop(), 5);
assert(queue.isEmpty())
console.log("order test pass");

Array2D = data_struct.Array2D;
assert.deepEqual(Array2D(2, 2, 5), [[5, 5], [5, 5]]);
console.log('2D array fill normal item passed');

function testReturn(i, j) {
	return {'x': i, 'y': j};
}

assert.deepEqual(Array2D(2, 2, testReturn),
	[[{'x': 0, 'y': 0}, {'x': 0, 'y': 1}],
	 [{'x': 1, 'y': 0}, {'x': 1, 'y': 1}]]);
console.log('2D array fill callback item passed');
