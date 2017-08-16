'use strict';

/**
 * Module dependencies
 */
var // passport for authentication
    passport = require('passport'),
    // the User model
    User = require('mongoose').model('User'),
    // path
    path = require('path'),
    // the application configuration
    config = require(path.resolve('./config/config'));

/**
 * Module init function
 */
module.exports = function (app, db) {
    // =========================================================================
    // Passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // Passport needs ability to serialize and unserialize users out of session
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        // find the user
        User.findById(id, function(err, user) {
            // if error occured
            if (err) {
                // send internal error
                res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err) });
                console.log(clc.error(errorHandler.getDetailedErrorMessage(err)));
            }
            else if(user) {
                // get object value
                user = user.toObject({ hide: 'password', transform: true });
                done(err, user);
            }
            else {
                done(err, null);
            }
        });
    });

    // initialize strategies
    config.utils.getGlobbedPaths(path.join(__dirname, './strategies/**/*.js')).forEach(function (strategy) {
        require(path.resolve(strategy))(config);
    });

    // add passport's middleware
    app.use(passport.initialize());
    app.use(passport.session());
};