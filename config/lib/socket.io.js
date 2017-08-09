'use strict';

/**
 * Module dependencies.
 */
var // the application configuration
    config = require('../config'),
    // lodash
    path = require('path'),
    // the file system to read/write from/to files locally
    fs = require('fs'),
    // http server
    http = require('http'),
    // https server
    https = require('https'),
    // cookie parsing
    cookieParser = require('cookie-parser'),
    // passport for local authentication
    passport = require('passport'),
    // socket io
    socketio = require('socket.io'),
    // express session used for storing logged in sessions
    session = require('express-session'),
    // mongo session
    MongoStore = require('connect-mongo')(session),
    // clc colors for console logging
	clc = require('./clc');

/**
 * Define the Socket.io configuration method
 */
module.exports = function (app, db) {
    // the server
    var server;

    // if in secure mode
    if (config.secure && config.secure.ssl === true) {
        // load SSL key and certificate
        var privateKey = fs.readFileSync(path.resolve(config.secure.privateKey), 'utf8');
        var certificate = fs.readFileSync(path.resolve(config.secure.certificate), 'utf8');
        var caBundle;

        try {
            caBundle = fs.readFileSync(path.resolve(config.secure.caBundle), 'utf8');
        } 
        catch (err) {
            console.log(clc.warning('Warning: couldn\'t find or read caBundle file'));
        }

        var options = {
            key: privateKey,
            cert: certificate,
            ca: caBundle,
            //  requestCert : true,
            //  rejectUnauthorized : true,
            secureProtocol: 'TLSv1_method',
            ciphers: [
            'ECDHE-RSA-AES128-GCM-SHA256',
            'ECDHE-ECDSA-AES128-GCM-SHA256',
            'ECDHE-RSA-AES256-GCM-SHA384',
            'ECDHE-ECDSA-AES256-GCM-SHA384',
            'DHE-RSA-AES128-GCM-SHA256',
            'ECDHE-RSA-AES128-SHA256',
            'DHE-RSA-AES128-SHA256',
            'ECDHE-RSA-AES256-SHA384',
            'DHE-RSA-AES256-SHA384',
            'ECDHE-RSA-AES256-SHA256',
            'DHE-RSA-AES256-SHA256',
            'HIGH',
            '!aNULL',
            '!eNULL',
            '!EXPORT',
            '!DES',
            '!RC4',
            '!MD5',
            '!PSK',
            '!SRP',
            '!CAMELLIA'
            ].join(':'),
            honorCipherOrder: true
        };

        // create new HTTPS Server
        server = https.createServer(options, app);
    } 
    else {
        // create a new HTTP server
        server = http.createServer(app);
    }

    // create a new Socket.io server
    var io = socketio.listen(server);

    // create a MongoDB storage object
    var mongoStore = new MongoStore({
        mongooseConnection: db.connection,
        collection: config.sessionCollection
    });

    // intercept Socket.io's handshake request
    io.use(function (socket, next) {
        // use the 'cookie-parser' module to parse the request cookies
        cookieParser(config.sessionSecret)(socket.request, {}, function (err) {
            // Get the session id from the request cookies
            var sessionId = socket.request.signedCookies ? socket.request.signedCookies[config.sessionKey] : undefined;

            // if a session id isn't present
            if (!sessionId) {
                return next(new Error('sessionId was not found in socket.request'), false);
            }

            // use the mongoStorage instance to get the Express session information
            mongoStore.get(sessionId, function (err, session) {
                // if error occurred
                if (err) {
                    return next(err, false);
                } 

                // if no session
                if (!session) {
                    return next(new Error('session was not found for ' + sessionId), false);
                } 

                // set the Socket.io session information
                socket.request.session = session;

                // use Passport to populate the user details
                passport.initialize()(socket.request, {}, function () {
                    passport.session()(socket.request, {}, function () {
                        // if the user exists
                        if (socket.request.user) {
                            next(null, true);
                        } 
                        else {
                            next(new Error('User is not authenticated'), false);
                        }
                    });
                });
            });
        });
    });

    // add an event listener to the 'connection' event
    io.on('connection', function (socket) {
        config.files.server.sockets.forEach(function (socketConfiguration) {
            require(path.resolve(socketConfiguration))(io, socket);
        });
    });

    // TODO: add io socket stuff from server.js file
    return server;
};