// the server
var express = require('express');

// express session used for storing logged in sessions
var expressSession = require('express-session');

// the http request validator
var expressValidator = require('express-validator');

// mongo session
var MongoStore = require('connect-mongo')(expressSession);

// the http body parser
var bodyParser = require('body-parser');

// mongoose for mongodb
var mongoose = require('mongoose'),
	// the User Schema
	User = require('./server/models/model-user'),
	// the Blog Post Schema
	BlogPost = require('./server/models/model-blog-post'),
	// the Saved Blog Post Schema
	SavedBlogPost = require('./server/models/model-saved-blog-post');

// passport for local authentication
var passport = require('passport');

// local strategy for local authentication
var LocalStrategy = require('passport-local').Strategy;

// cookie parsing
var cookieParser = require('cookie-parser');

// middleware logger
var morgan = require('morgan');

// flash messages
var flash = require('connect-flash');

// path 
var path = require('path');

// the secrets
var secrets = require('./server/secrets');

// config file
var config = require('./config/env/default');

// create a new Express application.
var app = express();

// set up all configurations
// set public views
app.set('views', path.join(__dirname, 'client'));

// set view engine
app.set('view engine', 'html');

// middleware logger
app.use(morgan('dev'));

// use HTTP Body Parser encoded
app.use(bodyParser.urlencoded({
	extended: true
}));

// use HTTP Body Parser json
app.use(bodyParser.json());

// load public files
app.use(express.static(path.join(__dirname, 'client')));    

// use header/body validation
app.use(expressValidator());

// db connection string and options
var options = {
	db: { native_parser: true },
	server: { poolSize: 5 },
	user: secrets.db_user,
	pass: secrets.db_pass
}

// mongoose
var mongooseDBConnect = mongoose.connect(secrets.db, null, function(err) {}); //, options);

// Express MongoDB session storage
app.use(expressSession({
	saveUninitialized: false,
	resave: false,
	secret: config.sessionSecret,
	cookie: {
		maxAge: config.sessionCookie.maxAge,
		httpOnly: config.sessionCookie.httpOnly,
		secure: config.sessionCookie.secure && config.secure.ssl
	},
	name: config.sessionKey,
	unset: 'destroy',
	store: new MongoStore({
		mongooseConnection: mongooseDBConnect.connection,
		collection: config.sessionCollection
	})
}));

// passport config
require('./server/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// define the routes     
//app.use(require('./server/routes'));
require('./server/routes')(app, passport);

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

/*
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
*/

// begin server
var server = app.listen(secrets.port, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('App running at //%s:%s', host, port);
});