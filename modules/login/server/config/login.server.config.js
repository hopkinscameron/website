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
        User.findById(id, function(err, user) {
            // get object value
            user = user.toObject({ hide: 'password', transform: true });
            done(err, user);
        });
    });

    // Initialize strategies
    config.utils.getGlobbedPaths(path.join(__dirname, './strategies/**/*.js')).forEach(function (strategy) {
        require(path.resolve(strategy))(config);
    });

    // Add passport's middleware
    app.use(passport.initialize());
    app.use(passport.session());
};