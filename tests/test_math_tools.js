const assert = require('assert');
math_tools = require('../utils/math_tools');

assert((3.455555).simEq(3.45566, 3));
console.log('similar equal test passes');

assert(!(3.4555).simEq(3.4556, 4));
console.log('similar not equal test passes');