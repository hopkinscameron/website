'use strict';

/**
 * Module dependencies
 */
var // the path
    path = require('path'),
    // the error handler
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    // chalk for console logging
    clc = require(path.resolve('./config/lib/clc')),
    // passport for local authentication
	passport = require('passport');

/**
 * Checks if user is already authenticated
 */
exports.checkLoggedIn = function (req, res) {
    // if user is authenticated in the session
    if (req.isAuthenticated()) {
        // return is logged in
        res.json({ 'd': { 'isLoggedIn': true } });
    }
    else {
        // return is logged in
        res.json({ 'd': { 'isLoggedIn': false } });
    }
};

/**
 * Signs user up
 */
exports.signUp = function (req, res, next) {
    // authenticate the user with a signup
    passport.authenticate('local-signup', {
		successRedirect : '/about', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the home page if there is an error
		failureFlash : true // allow flash messages
	})(req, res, next);
};

/**
 * Logs user in
 */
exports.login = function (req, res, next) {
    // authenticate user login
    passport.authenticate('local-login', function (err, user, info) {
        // if error
        if(err) {
            // send internal error
            res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err) });
            console.log(clc.error(errorHandler.getDetailedErrorMessage(err)));
        }
        // if user is not authenticated 
        else if(!user) {
            // return not authenticated
            res.json({ 'd': { error: true, title: "Incorrect username/password.", message: "Incorrect username/password." } });
        }
        else {
            // return authenticated
            res.json({ 'd': { title: errorHandler.getErrorTitle({ code: 200 }), message: errorHandler.getGenericErrorMessage({ code: 200 }) + " Successful login." } });
        }
    })(req, res, next);
};