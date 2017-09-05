'use strict';

/**
 * Module dependencies
 */
var // passport for authentication
    passport = require('passport'),
    // the local strategy
    LocalStrategy = require('passport-local').Strategy;

module.exports = function () {
    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
            // FIXME: fix to write to local file
            // find a user whose username is the same as the forms username
            // we are checking to see if the user trying to login already exists
            User.findOne({ username : username }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // check to see if theres already a user with that username
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } 
                else {
                    // if there is no user with that username
                    // create the user
                    var newUser = new User();

                    // set the user's local credentials
                    newUser.username = username;
                    newUser.password = password;
                    newUser.passwordUpdatedLast = new Date();

                    // save the user
                    newUser.save(function(err) {
                        // if error occurred
                        if (err) {
                            throw err;
                        }
                            
                        return done(null, newUser);
                    });
                }
            });    
        });
    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function (req, username, password, done) {
        // convert to lowercase
        username = username ? username.toLowerCase() : username;

        // FIXME: fix to read from local file
        // find a user whose username is the same as the forms username
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'username' : username }, function (err, user) {
            // if error occurred
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
                // if the user is found but the password is wrong or an error occurred
				if (err || !isMatch) {
                    // create the loginMessage and save it to session as flashdata
                    return done(null, false);
				}

                // set updated values 
                var updatedValues = {
                    "lastLogin": new Date()
                };

                // update user
                user.update(updatedValues).exec(function(err) {
                    // if error occurred
                    if (err) {
                        return done(err);
                    }
                    else {
                        // set all updated values
                        user.lastLogin = updatedValues.lastLogin;

                        // get object value
                        user = user.toObject({ hide: 'password', transform: true });

                        // login
                        req.login(user, function (err) {
                            // if error occurred
                            if (err) {
                                return done(err);
                            } 
                            else {
                                // all is well, return successful user
                                return done(null, user);
                            }
                        });
                    }
                });
			});	
        });
    }));
};
