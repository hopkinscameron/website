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

module.exports = function (app, passport) {
    // GET gets login page
    // POST log user in
	// format /login
    app.route('/login').get(ipLogger.log, loginController.checkLoggedIn)
        .post(ipLogger.log, loginController.login);

    // POST signs user up
	// format /signup
    app.route('/signup').post(ipLogger.log, passport.authenticate('local-signup', {
		successRedirect : '/about', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the home page if there is an error
		failureFlash : true // allow flash messages
	}));
};