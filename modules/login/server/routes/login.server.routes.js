'use strict';

/**
 * Module dependencies
 */
var // the path
    path = require('path'),
    // the ip logger
    ipLogger = require(path.resolve('./config/lib/ip.logger')),
    // the login controller to handle routes
    loginController = require('../controllers/login.server.controller');

module.exports = function (app) {
    // GET gets login page
    // POST log user in
	// format /login
    app.route('/login').get(ipLogger.log, loginController.checkLoggedIn)
        .post(ipLogger.log, loginController.login);

    // POST signs user up
	// format /signup
    app.route('/signup').post(ipLogger.log, loginController.signUp);

    // GET gets random passphrase
	// format /generateRandomPassphrase
    app.route('/generateRandomPassphrase').get(loginController.generateRandomPassphrase);

    // PUT changes password
	// format /changePassword/:username
    app.route('/changePassword/:username').put(loginController.changePassword);

    // if username exists, bind the User by username middleware
	app.param('username', loginController.userById);
};