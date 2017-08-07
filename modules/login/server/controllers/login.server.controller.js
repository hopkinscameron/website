'use strict';

/**
 * Module dependencies
 */
var // the path
    path = require('path'),
    // the error handler
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    // chalk for console logging
    clc = require(path.resolve('./config/lib/clc'));

/**
 * Checks if user is already authenticated
 */
exports.checkLoggedIn = function (req, res) {
    // if user is not authenticated in the session, carry on 
    if (!req.isAuthenticated()) {
        // return not logged in
        res.status(200).send({ title: errorMessageCenter.error.status200.title, message: errorMessageCenter.error.status200.message + " User not logged in." });
    }
    else {
        // return logged in
        res.status(200).send({ title: errorMessageCenter.error.status200.title, message: errorMessageCenter.error.status200.message + " User is logged in.", isLoggedIn: true });
    }
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
            res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getErrorMessage(err) });
            console.log(clc.error(errorHandler.getErrorMessage(err)));
        }
        // if user is not authenticated 
        else if(!user) {
            // send incorrect information provided
            res.status(200).send({ error: true, title: "Incorrect username/password.", message: "Incorrect username/password." });
        }
        else {
            // return successful
            res.status(200).send({ title: errorMessageCenter.error.status200.title, message: errorMessageCenter.error.status200.message + " Successful login." });
        }
    })(req, res, next);
};

/**
 * Signs user up
 */
exports.signUp = function (req, res, next) {

};