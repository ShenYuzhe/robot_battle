var fs = require('fs');

function mkdirIfNotExist(path) {
	if (!fs.existsSync(path))
		fs.mkdirSync(path);
}

var workdir = function() {
	var basedir = '/tmp/robot'
	mkdirIfNotExist(basedir);
	mkdirIfNotExist(basedir + '/usrs');
	return basedir;

}();

function createUsrWarehouse(usr) {
	return mkdirIfNotExist(workdir + '/usrs/' + usr);
}
exports.createUsrWarehouse = createUsrWarehouse;

