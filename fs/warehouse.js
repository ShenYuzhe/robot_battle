var fs = require('fs');
var q = require('q');
var co = require('co');

function mkdirIfNotExist(path) {
	if (!fs.existsSync(path))
		fs.mkdirSync(path);
}

var workDir = function() {
	var basedir = '/tmp/robot';
	mkdirIfNotExist(basedir);
	return basedir;
}();
exports.workDir = workDir;

var shopDir = function() {
	var shopdir = workDir + '/shop';
	mkdirIfNotExist(shopdir);
	return shopdir;
}();
exports.shopDir = shopDir;

var usrRootDir = function() {
	var usrDir = workDir + '/usrs';
	mkdirIfNotExist(usrDir);
	return usrDir;
}();
exports.usrRootDir = usrRootDir;

var robotShopDir = function() {
	var robotDir = shopDir + '/robots';
	mkdirIfNotExist(robotDir);
	return shopDir;
}();
exports.shopDir = shopDir;

var driverShopDir = function() {
	var driverDir = shopDir + '/drivers';
	mkdirIfNotExist(driverDir);
	return driverDir;
}();
exports.driverShopDir = driverShopDir;

function shopDriverByName(name) {
	return require(driverShopDir + '/' + name).driver;
}
exports.shopDriverByName = shopDriverByName;

function createUsrWarehouse(usr) {
	return mkdirIfNotExist(usrRootDir + '/' + usr);
}
exports.createUsrWarehouse = createUsrWarehouse;

function writeFile(path, data) {
	return fs.writeFileAsync(path, data);	
}
exports.writeFile = writeFile;

function mvExFile(file, path) {
	var deferred = q.defer();
	file.mv(path, (err) => {
		if (err)
			deferred.reject(err);
		else
			deferred.resolve('success');
	});
	return deferred.promise;
}
exports.mvExFile = mvExFile;