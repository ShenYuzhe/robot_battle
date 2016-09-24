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

