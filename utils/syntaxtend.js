deepcopy = require('deepcopy');

exports.inherit = function(father, son) {
	
	for (prop in father)
		son[prop] = deepcopy(father[prop]);

}
