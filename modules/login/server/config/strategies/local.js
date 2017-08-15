'use strict';

/**
 * Module dependencies
 */
var // passport for authentication
    passport = require('passport'),
    // the local strategy
    LocalStrategy = require('passport-local').Strategy,
    // the User model
    User = require('mongoose').model('User');

module.exports = function () {
    // Use local strategy
    passport.use(new LocalStrategy({
        usernameField: 'usernameOrEmail',
        passwordField: 'password'
    },
    function (usernameOrEmail, password, done) {
        // find the user by email or username
        User.findOne({
            $or: [{
                username: usernameOrEmail.toLowerCase()
            }, {
                email: usernameOrEmail.toLowerCase()
            }]
        }, function (err, user) {
            // if there are any errors, return the error before anything else
            if (err) {
                return done(err);
            } 

            // if no user is found, return the message
            if (!user) {
                // req.flash is the way to set flashdata using connect-flash
                return done(null, false);
            }

            // compare equality
            user.comparePassword(password, function(err, isMatch) {
                // if the user is found but the password is wrong
				if (err || !isMatch) {
                    // create the loginMessage and save it to session as flashdata
                    return done(null, false);
				}

                // get object value
                user = user.toObject({ hide: 'password', transform: true });

                // login
				req.login(user, function (err) {
					if (err) {
						return done(err);
                    } 
                    else {
						// all is well, return successful user
                        return done(null, user);
					}
				});
			});	
        });
    }));
};
