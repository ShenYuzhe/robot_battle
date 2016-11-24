var express = require('express');
var fileUpload = require('express-fileupload');

var logger = require('morgan');
var bodyParser = require('body-parser');

var dispatcher = require('./routes/dispatcher');

var app = express();
var expressWs = require('express-ws')(app);
app.listen(3000);
console.log('robot battle listening on port 3000');

// following is usage of middleware
/*app.use(function(req, res, next) {
		console.log('step 1');
		next();
	},function(req, res, next) {
		console.log('step 2');
		next();
	});*/

app.use(logger('dev'));
app.use(bodyParser());
app.use(fileUpload());
/* robot related apis */
app.put('/robot/:model', dispatcher.createRobot);
app.get('/robot/list', dispatcher.listRobots);

/* driver related apis*/
app.put('/driver/:name', dispatcher.uploadDriver);
app.get('/driver/list', dispatcher.listDrivers);

/*?modle1=model1&driver1=driver1&model2=model2&driver2=driver2*/
app.post('/fight', dispatcher.fight);

/* initiation of websocket */
app.ws('/watch', function(ws, req) {
    ws.on('message', (msg) => {
        var msgObj = JSON.parse(msg);
        var token = msgObj;
        var q = dispatcher.trainGround[token];
        while (q.length > 0)
            ws.send(q.pop());
    });
});
