var dc = require('./data_creator');
var db = require('../server/db/mongoAgent');
createModel = dc.createModel;
createDriver = dc.createDriver;

var db = require('../server/db/mongoAgent');
createUniqueShopIndex = db.createUniqueShopIndex;

var strong_model = require('./init_models/strong_model.json');
var aggressive_model = require('./init_models/aggressive_model.json');
var strong_driver = './init_drivers/strong.js';
var aggressive_driver = './init_drivers/aggressive.js';

createUniqueShopIndex().then(
    (resp) => {
        console.log(resp);
        return createModel('strong', strong_model)
    }
).then(
    (resp) => {
        console.log(resp);
        return createModel('aggressive', aggressive_model);
    }
).then(
    (resp) => {
        console.log(resp);
        return createDriver('strong', strong_driver);
    }
).then(
    (resp) => {
        console.log(resp);
        return createDriver('aggressive', aggressive_driver);
    }
).then(console.log)
.catch(console.log);
