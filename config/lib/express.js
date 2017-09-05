'use strict';

/**
 * Module dependencies.
 */
var // the application configuration
    config = require('../config'),
    // the server
    express = require('express'),
    // the http request validator
    expressValidator = require('express-validator'),
    // passport for local authentication
	passport = require('passport'),
    // middleware logger
    morgan = require('morgan'),
    // the logger configuration
    logger = require('./logger'),
    // the http body parser
    bodyParser = require('body-parser'),
    // express session used for storing logged in sessions
    session = require('express-session'),
    // mongo session
    MongoStore = require('connect-mongo')(session),
    // fav icon serve
    favicon = require('serve-favicon'),
    // file compression
    compress = require('compression'),
    // method overriding
    methodOverride = require('method-override'),
    // cookie parsing
    cookieParser = require('cookie-parser'),
    // helmet for helping secure http headers
    helmet = require('helmet'),
    // flash messages
    flash = require('connect-flash'),
    // handlebars template
    hbs = require('express-hbs'),
    // path 
    path = require('path'),
    // lodash
    _ = require('lodash'),
    // lusca for web application security middleware
    lusca = require('lusca');

/**
 * Initialize local variables
 */
module.exports.initLocalVariables = function (app) {
    // setting application local variables
    app.locals.title = config.app.title;
    app.locals.description = config.app.description;
    
    // if secure mode
    if (config.secure && config.secure.ssl === true) {
        app.locals.secure = config.secure.ssl;
    }

    app.locals.keywords = config.app.keywords;
    app.locals.googleAnalyticsTrackingID = config.app.googleAnalyticsTrackingID;
    app.locals.appInsightsAnalyticsTrackingID = config.app.appInsightsAnalyticsTrackingID === 'APP_INSIGHTS_ANALYTICS_TRACKING_ID' ? null : config.app.appInsightsAnalyticsTrackingID;
    app.locals.jsFiles = config.files.client.js;
    app.locals.cssFiles = config.files.client.css;
    app.locals.livereload = config.livereload;
    app.locals.logo = config.logo;
    app.locals.favicon = config.favicon;
    app.locals.env = process.env.NODE_ENV;
    app.locals.domain = config.domain;
    app.locals.facebookUsername = config.socialMedia.facebook.username;
    app.locals.instagramUsername = config.socialMedia.instagram.username;
    app.locals.linkedinUsername = config.socialMedia.linkedin.username;
    app.locals.twitterUsername = config.socialMedia.twitter.username;
    app.locals.youtubeUsername = config.socialMedia.youtube.username;

    // passing the request url to environment locals
    app.use(function (req, res, next) {
        res.locals.host = req.protocol + '://' + req.hostname;
        res.locals.url = req.protocol + '://' + req.headers.host + req.originalUrl;
        next();
    });
};

/**
 * Initialize application middleware
 */
module.exports.initMiddleware = function (app) {
    // should be placed before express.static
    app.use(compress({
        filter: function (req, res) {
            return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    // initialize favicon middleware
    app.use(favicon(app.locals.favicon));

    // enable logger (morgan) if enabled in the configuration file
    if (_.has(config, 'log.format')) {
        app.use(morgan(logger.getLogFormat(), logger.getMorganOptions()));
    }

    // environment dependent middleware
    if (process.env.NODE_ENV === 'development') {
        // disable views cache
        app.set('view cache', false);
    } 
    else if (process.env.NODE_ENV === 'production') {
        app.locals.cache = 'memory';
    }
    else if (process.env.NODE_ENV === 'testdev') {
        app.locals.cache = 'memory';
    }
    else {
        // disable views cache
        app.set('view cache', false);
    }

    // request body parsing middleware should be above methodOverride
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    // add the cookie parser and flash middleware
    app.use(cookieParser());
    app.use(flash());

    // use header/body validation
    app.use(expressValidator());
};

/**
 * Configure view engine
 */
module.exports.initViewEngine = function (app) {
    app.engine('server.view.html', hbs.express4({
        extname: '.server.view.html'
    }));
    app.set('view engine', 'server.view.html');
    app.set('views', path.resolve('./'));
};

/**
 * Configure Express session
 */
module.exports.initSession = function (app, db) {
    // Express MongoDB session storage
    app.use(session({
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
            mongooseConnection: config.db.options.useMongoClient ? db : db.connection,
            collection: config.sessionCollection,
            clear_interval: config.clearInterval
        })
    }));

    // add Lusca CSRF Middleware
    app.use(lusca(config.csrf));
};

/**
 * Invoke modules server configuration
 */
module.exports.initModulesConfiguration = function (app, db) {
    // globbing module configuration
    config.files.server.configs.forEach(function (configPath) {
        require(path.resolve(configPath))(app, db);
    });
};

/**
 * Configure Helmet headers configuration for security
 */
module.exports.initHelmetHeaders = function (app) {
    // six months expiration period specified in seconds
    var SIX_MONTHS = 15778476;

    app.use(helmet.frameguard());
    app.use(helmet.xssFilter());
    app.use(helmet.noSniff());
    app.use(helmet.ieNoOpen());
    app.use(helmet.hsts({
        maxAge: SIX_MONTHS,
            includeSubdomains: true,
            force: true
    }));
    app.disable('x-powered-by');
};

/**
 * Configure the modules static routes
 */
module.exports.initModulesClientRoutes = function (app) {
    // setting the app router and static folder
    app.use('/', express.static(path.resolve('./public'), { maxAge: 86400000 }));

    // globbing static routing
    config.folders.client.forEach(function (staticPath) {
        app.use(staticPath, express.static(path.resolve('./' + staticPath)));
    });
};

/**
 * Configure the modules policies
 */
module.exports.initModulesServerPolicies = function (app) {
    // globbing policy files
    config.files.server.policies.forEach(function (policyPath) {
        require(path.resolve(policyPath)).invokeRolesPolicies();
    });
};

/**
 * Configure the modules server routes
 */
module.exports.initModulesServerRoutes = function (app) {
    // globbing routing files
    config.files.server.routes.forEach(function (routePath) {
        require(path.resolve(routePath))(app);
    });
};

/**
 * Configure error handling
 */
module.exports.initErrorRoutes = function (app) {
    // use error routing
    app.use(function (err, req, res, next) {
        // If the error object doesn't exists
        if (!err) {
            return next();
        }

        // log it
        console.error(err.stack);

        // redirect to error page
        res.redirect('/server-error');
    });
};

/**
 * Configure Socket.io
 */
module.exports.configureSocketIO = function (app, db) {
    // load the Socket.io configuration
    var server = require('./socket.io')(app, db);

    // return server object
    return server;
};

/**
 * Initialize the Express application
 */
module.exports.init = function (db) {
    // initialize express app
    var app = express();

    console.log('----- ');
    console.log('----- Initializing local variables');
    console.log('----- ');

    // initialize local variables
    this.initLocalVariables(app);

    console.log('----- ');
    console.log('----- Done Initializing local variables');
    console.log('----- ');

    console.log('----- ');
    console.log('----- Initializing middleware');
    console.log('----- ');

    // initialize Express middleware
    this.initMiddleware(app);

    console.log('----- ');
    console.log('----- Done Initializing middleware');
    console.log('----- ');

    console.log('----- ');
    console.log('----- Initializing view engine');
    console.log('----- ');

    // initialize Express view engine
    this.initViewEngine(app);

    console.log('----- ');
    console.log('----- Done Initializing view engine');
    console.log('----- ');

    console.log('----- ');
    console.log('----- Initializing helmet headers');
    console.log('----- ');

    // initialize Helmet security headers
    this.initHelmetHeaders(app);

    console.log('----- ');
    console.log('----- Done Initializing helmet headers');
    console.log('----- ');

    console.log('----- ');
    console.log('----- Initializing client routes');
    console.log('----- ');

    // initialize modules static client routes, before session!
    this.initModulesClientRoutes(app);

    console.log('----- ');
    console.log('----- Done Initializing client routes');
    console.log('----- ');

    console.log('----- ');
    console.log('----- Initializing session');
    console.log('----- ');

    // initialize Express session
    this.initSession(app, db);

    console.log('----- ');
    console.log('----- Done Initializing session');
    console.log('----- ');

    console.log('----- ');
    console.log('----- Initializing module configuration');
    console.log('----- ');

    // initialize Modules configuration
    this.initModulesConfiguration(app);

    console.log('----- ');
    console.log('----- Done Initializing module configuration');
    console.log('----- ');

    // initialize modules server authorization policies
    //this.initModulesServerPolicies(app);

    console.log('----- ');
    console.log('----- Initializing server routes');
    console.log('----- ');

    // initialize modules server routes
    this.initModulesServerRoutes(app);

    console.log('----- ');
    console.log('----- Done Initializing server routes');
    console.log('----- ');

    // initialize error routes
    //this.initErrorRoutes(app);

    console.log('----- ');
    console.log('----- Initializing socket io');
    console.log('----- ');

    // configure Socket.io
    app = this.configureSocketIO(app, db);

    console.log('----- ');
    console.log('----- Done Initializing socket io');
    console.log('----- ');

    return app;
};