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
};