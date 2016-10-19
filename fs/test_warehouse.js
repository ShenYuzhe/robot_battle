var warehouse = require('./warehouse');
var fs = require('fs');
var assert = require('assert');

warehouse.createUsrWarehouse('empire');
fs.exists('/tmp/robot/usrs/empire', (exists) => { assert(exists)});
console.log('create user folder succeeds');
