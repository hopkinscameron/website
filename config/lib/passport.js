/**
 * Module dependencies
 */
var // use local strategy for sign up/logging in
    LocalStrategy = require('passport-local').Strategy,
    // the mongoose
    mongoose = require('mongoose'),
    // load up the user model
    User = mongoose.model('User');

module.exports = function(passport) {
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
            done(err, user);
        });
    });

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
            // find a user whose username is the same as the forms username
            // we are checking to see if the user trying to login already exists
            User.findOne({ username : username }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // check to see if theres already a user with that username
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    var newUser = new User();

                    // set the user's local credentials
                    newUser.username = username;
                    newUser.password = password;

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
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
    function(req, username, password, done) { // callback with username and password from our form

        // find a user whose username is the same as the forms username
        // we are checking to see if the user trying to login already exists
        User.findOne({ username :  username }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

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
                user = user.toObject({hide: 'password', transform: true});

                // login
				req.login(user, function (err) {
					if (err) {
						return done(err);
					} else {
						// all is well, return successful user
                        return done(null, user);
					}
				});
			});	
        });
    }));
};