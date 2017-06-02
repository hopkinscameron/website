// the server
var express = require('express');

// the http body parser
var bodyParser = require('body-parser');

// create a new Express application.
var app = express();

// the secrets
var secrets = require('./server/secrets');

// set up all configurations
// set public views
app.set('views', __dirname + '/client');

// set view engine
app.set('view engine', 'html');

// use HTTP Body Parser encoded
app.use(bodyParser.urlencoded({
	extended: true
}));

// use HTTP Body Parser json
app.use(bodyParser.json());

// load public files
app.use(express.static('client'));    

// define the routes     
app.use(require('./server/routes'));

// logs client IP address with every request
app.use(function (req, res, next) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	//console.log('Client IP:', ip);
	next();
});

// on get
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/client/index.html')
})

// begin server
var server = app.listen(secrets.port, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('App running at //%s:%s', host, port);
});