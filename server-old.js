'use strict';
process.env.NODE_ENV = 'development';

/**
 * Module dependencies.
 */
var // the server
	express = require('express'),
	// express session used for storing logged in sessions
	expressSession = require('express-session'),
	// the http request validator
	expressValidator = require('express-validator'),
	// mongo session
	MongoStore = require('connect-mongo')(expressSession),
	// the http body parser
	bodyParser = require('body-parser'),
	// mongoose for mongodb
	mongoose = require('mongoose'),
	// passport for local authentication
	passport = require('passport'),
	// cookie parsing
	cookieParser = require('cookie-parser'),
	// middleware logger
	morgan = require('morgan'),
	// flash messages
	flash = require('connect-flash'),
	// path 
	path = require('path'),
	// lodash
	_ = require('lodash'),
	// glob for path/pattern matching
	glob = require('glob'),
	// clc colors for console logging
	clc = require('./config/lib/clc'),
	// get the default assets
  	defaultAssets = require(path.join(process.cwd(), 'config/assets/default')),
  	// get the environment assets
  	environmentAssets = require(path.join(process.cwd(), 'config/assets/', process.env.NODE_ENV)) || {},
	// get the default config
	defaultConfig = require(path.join(process.cwd(), 'config/env/default')),
	// get the current config
	environmentConfig = require(path.join(process.cwd(), 'config/env/', process.env.NODE_ENV)) || {},
	// read package.json for project information
	pkg = require(path.resolve('./package.json'));

// socket io
var socketIO = undefined;

// merge assets
var assets = _.merge(defaultAssets, environmentAssets);

// merge config files
var config = _.merge(defaultConfig, environmentConfig);

// set the personal website package
config.personalWebsite = pkg;

// initialize global globbed files
initGlobalConfigFiles(config, assets);

// create a new Express application.
var app = express();

// set up all configurations
// set public views
app.set('views', path.join(__dirname, 'modules'));

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
app.use(express.static(path.join(__dirname, 'modules')));    

// use header/body validation
app.use(expressValidator());

// db connection string and options
var options = {
	db: { native_parser: true },
	server: { poolSize: 5 },
	user: config.db.options.user,
	pass: config.db.options.pass
}

// mongoose
var mongooseDBConnect = mongoose.connect(config.db.uri, { }, function(err) {
	// if error
	if(err) {
		console.log(clc.error(err.message));
		process.exit();
	}
	
	// start server
	startServer();
}); //, options);

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
		collection: config.sessionCollection,
		clear_interval: config.clearInterval
	})
}));

// set up the routes
setUpRoutes();

// passport config -> 
require('./server/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// logs client IP address with every request
app.use(function (req, res, next) {
	// var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	// console.log(clc.info('Client IP:', ip));
	next();
});

// on get
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/modules/index.html')
});

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

// starts the server
function startServer() {
	var server = require('http').Server(app);
	socketIO = require('socket.io')(server);
	setUpIOSocket();
	
	// begin server
	server.listen(config.port, function () {
		var host = server.address().address;
		var port = server.address().port;
		
		// create server URL
		var url = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.host + ':' + config.port;

		// logging initialization
		console.log('--');
		console.log(clc.success(config.app.title));
		console.log();
		console.log(clc.success('Environment:     ' + process.env.NODE_ENV));
		console.log(clc.success('Server:          ' + url));
		console.log(clc.success('Database:        ' + config.db.uri));
		console.log(clc.success('App version:     ' + '2.0.0'));
		console.log('--');
	});
};

const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);

// sets up the io socket
function setUpIOSocket() {
	socketIO.on('connection', function (socket) {
		sendSignalToUpdateBlogs(socket);

		// when the client emits 'update blog', this listens and executes
		socket.on('reset', function (data) {
			sendSignalToUpdateBlogs(socket);
		});
	});
};

// emits update blog
function sendSignalToUpdateBlogs(socket) {
	setTimeoutPromise(60000).then(() => {
		// This is executed after about 60 second.
		socket.emit('update saved blogs');
	});
};

/**
 * Initialize global configuration files
 */
function initGlobalConfigFiles(config, assets) {
	// appending files
	config.files = {
		server: {},
		client: {}
	};

	// setting globbed model files
	config.files.server.models = getGlobbedPaths(assets.server.models);

	// setting globbed route files
	config.files.server.routes = getGlobbedPaths(assets.server.routes);

	// setting globbed config files
	config.files.server.configs = getGlobbedPaths(assets.server.config);

	// setting globbed socket files
	config.files.server.sockets = getGlobbedPaths(assets.server.sockets);

	// setting globbed policies files
	config.files.server.policies = getGlobbedPaths(assets.server.policies);

	// setting globbed js files
	config.files.client.js = getGlobbedPaths(assets.client.lib.js, 'public/').concat(getGlobbedPaths(assets.client.js, ['public/']));

	// setting globbed css files
	config.files.client.css = getGlobbedPaths(assets.client.lib.css, 'public/').concat(getGlobbedPaths(assets.client.css, ['public/']));

	// setting globbed test files
	config.files.client.tests = getGlobbedPaths(assets.client.tests);
};

/**
 * Get files by glob patterns
 */
function getGlobbedPaths(globPatterns, excludes) {
	// URL paths regex
	var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

	// The output array
	var output = [];

	// If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
	if (_.isArray(globPatterns)) {
		globPatterns.forEach(function (globPattern) {
			output = _.union(output, getGlobbedPaths(globPattern, excludes));
		});
	} 
	else if (_.isString(globPatterns)) {
		if (urlRegex.test(globPatterns)) {
			output.push(globPatterns);
		} 
		else {
			var files = glob.sync(globPatterns);
			if (excludes) {
				files = files.map(function (file) {
					if (_.isArray(excludes)) {
						for (var i in excludes) {
							if (excludes.hasOwnProperty(i)) {
								file = file.replace(excludes[i], '');
							}
						}
					} 
					else {
						file = file.replace(excludes, '');
					}
					return file;
				});
			}
			output = _.union(output, files);
		}
	}

	return output;
};

/**
 * Set up routes
 */
function setUpRoutes() {
	// globbing model files
	config.files.server.models.forEach(function (modelPath) {
		require(path.resolve(modelPath));
	});

	// define the routes     
	require('./server/routes')(app)//, passport);

	// globbing routing files
	config.files.server.routes.forEach(function (routePath) {
		require(path.resolve(routePath))(app);
	});
};