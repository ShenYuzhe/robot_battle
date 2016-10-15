DEFAULT_DIGIT = 5;
Number.prototype.simEq = function(number, digits) {
	digits = digits == undefined ? DEFAULT_DIGIT : digits;
	var n1 = this.toFixed(digits);
	var n2 = number.toFixed(digits);
	if (n1 == -0)
		n1 = 0;
	if (n2 == -0)
		n2 = 0;
	return n1 == n2;
}

