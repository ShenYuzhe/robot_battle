var express = require('express');
var fileUpload = require('express-fileupload');
var dispatcher = require('./routes/dispatcher');

var app = express();
app.listen(3000);

// following is usage of middleware
/*app.use(function(req, res, next) {
		console.log('step 1');
		next();
	},function(req, res, next) {
		console.log('step 2');
		next();
	});*/

app.configure(
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(fileUpload());
);

/* robot related apis */
app.put('/robot/:model', dispatcher.createRobot);
app.get('/robot/list', dispatcher.listRobots);

/* driver related apis*/
app.put('/driver/:name', dispatcher.uploadDriver);
app.get('/driver/list', dispatcher.listRobots);

app.post('/fight', dispatcher.fight);