const assert = require('assert');
math_tools = require('../utils/math_tools');

similarEq = math_tools.similarEq;
assert(similarEq(3.455555, 3.45566, 3));
console.log('similar equal test passes');

assert.fail(similarEq(3.4555, 3.4556, 4));
console.log('similar not equal test passes');