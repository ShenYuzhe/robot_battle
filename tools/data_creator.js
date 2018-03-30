var rp = require('request-promise');
var request = require('request');
var fs = require('fs');

var config = require('./config.json');

function getUrl(suffix) {
    return config.protocol + '://' +  config.server_host + suffix;
}

function createDriver(name, driver) {
    var options = {
        url: getUrl('/driver/' + name),
        formData: {
            'driver': fs.createReadStream(driver)
        }
    }
    return rp.put(options);
}

function createModel(name, model) {
    var options = {
        url: getUrl('/robot/' + name),
        headers: {
            'content-type': 'application/json'
        },
        json: true,
        body: model
    }
    return rp.put(options);

}

exports.createDriver = createDriver;
exports.createModel = createModel;
