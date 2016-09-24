similarEq = function(v1, v2, digit) {
	
	if (Math.floor(v1) != Math.floor(v2))
		return false;

	var t1 = Math.floor(v1 * Math.pow(10, digit)),
		t2 = Math.floor(v2 * Math.pow(10, digit));

	return t1 == t2;
}
exports.similarEq = similarEq;