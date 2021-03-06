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
    passport = require('passport'),
    // the application configuration
    config = require(path.resolve('./config/config')),
    // generator for a strong password
    generatePassword = require('generate-password'),
    // tester for generating a strong password
    owasp = require('owasp-password-strength-test'),
    // the User model
    User = require(path.resolve('./modules/login/server/models/model-user'));

// configure
owasp.config(config.shared.owasp);

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
    // used to not allow any additiona signups
    // send not found
    res.status(404).send({ title: errorHandler.getErrorTitle({ code: 404 }), message: 'There\'s nothing to see here.' });

    /*
    // validate existence
    req.checkBody('username', 'Username is required.').notEmpty();
    req.checkBody('password', 'Password is required.').notEmpty();
    
    // validate errors
    req.getValidationResult().then(function(errors) {
        // if any errors exists
        if(!errors.isEmpty()) {
            // holds all the errors in one text
            var errorText = '';

            // add all the errors
            for(var x = 0; x < errors.array().length; x++) {
                // if not the last error
                if(x < errors.array().length - 1) {
                    errorText += errors.array()[x].msg + '\r\n';
                }
                else {
                    errorText += errors.array()[x].msg;
                }
            }

            // send bad request
            res.status(400).send({ title: errorHandler.getErrorTitle({ code: 400 }), message: errorText });
        } 
        else {
            // authenticate the user with a signup
            passport.authenticate('local-signup', { successRedirect : '/about', failureRedirect : '/login', failureFlash : true }, function (err, user) {
                // if error
                if(err) {
                    // send internal error
                    res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err) });
                    console.log(clc.error(errorHandler.getDetailedErrorMessage(err)));
                }
                // if user is not signed up 
                else if(!user) {
                    // return not signed up 
                    res.json({ 'd': { error: true, title: 'Username already taken.', message: 'Username already taken.' } });
                }
                else {
                    // return authenticated
                    res.json({ 'd': { title: errorHandler.getErrorTitle({ code: 200 }), message: errorHandler.getGenericErrorMessage({ code: 200 }) + ' Successful login.' } });
                }
            })(req, res, next);
        }
    });
    */
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
            res.json({ 'd': { error: true, title: 'Incorrect username/password.', message: 'Incorrect username/password.' } });
        }
        else {
            // return authenticated
            res.json({ 'd': { title: errorHandler.getErrorTitle({ code: 200 }), message: errorHandler.getGenericErrorMessage({ code: 200 }) + ' Successful login.' } });
        }
    })(req, res, next);
};

/**
 * Generates random passphrase
 */
exports.generateRandomPassphrase = function (req, res, next) {
    // if user is authenticated in the session
    if (req.isAuthenticated()) {
        var passphrase = generateRandomPassphrase();

        // if not passphrase
        if(!passphrase) {
            // try one more time
            passphrase = generateRandomPassphrase();
        }

        // return passphrase
        res.json({ 'd': { 'passphrase': passphrase } });
    }
    else {
        // create forbidden error
        res.status(403).send({ title: errorHandler.getErrorTitle({ code: 403 }), message: errorHandler.getGenericErrorMessage({ code: 403 }) });
    }
};

/**
 * Changes password
 */
exports.changePassword = function (req, res, next) {
    // set the user
    var user = req.foundUser;

    // if found user
    if(user) {
        // set updated values 
        var updatedValues = {
            'password': req.body.newpassword
        };

        // update user
        User.update(user, updatedValues, function(err, updatedUser) {
            // if error occurred
            if (err) {
                // send internal error
                res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err) });
                console.log(clc.error(errorHandler.getDetailedErrorMessage(err)));
            }
            else if(updatedUser) {
                // return password changed
                res.json({ 'd': { title: errorHandler.getErrorTitle({ code: 200 }), message: errorHandler.getGenericErrorMessage({ code: 200 }) + ' Successful password change.' } });
            }
            else {
                // send internal error
                res.status(500).send({ error: true, title: errorHandler.getErrorTitle({ code: 500 }), message: errorHandler.getGenericErrorMessage({ code: 500 }) });
                console.log(clc.error(`In ${path.basename(__filename)} \'changePassword\': ` + errorHandler.getDetailedErrorMessage({ code: 500 }) + ' Couldn\'t update User.'));
            }
        });
    }
    else {
        // send not found
        res.status(404).send({ title: errorHandler.getErrorTitle({ code: 404 }), message: errorHandler.getGenericErrorMessage({ code: 404 }) + ' Usernmae/Password is incorrect.' });
    }
};

/**
 * User middleware
 */
exports.userById = function (req, res, next, id) {
    // if user is authenticated in the session
    if (req.isAuthenticated()) {
        // validate existence
        req.checkBody('username', 'Username is required.').notEmpty();
        req.checkBody('oldpassword', 'Old Password is required.').notEmpty();
        req.checkBody('newpassword', 'New Password is required.').notEmpty();
        
        // validate errors
        req.getValidationResult().then(function(errors) {
            // if any errors exists
            if(!errors.isEmpty()) {
                // holds all the errors in one text
                var errorText = '';

                // add all the errors
                for(var x = 0; x < errors.array().length; x++) {
                    // if not the last error
                    if(x < errors.array().length - 1) {
                        errorText += errors.array()[x].msg + '\r\n';
                    }
                    else {
                        errorText += errors.array()[x].msg;
                    }
                }

                // send bad request
                res.status(400).send({ title: errorHandler.getErrorTitle({ code: 400 }), message: errorText });
            }
            else {
                // convert to lowercase
                id = id ? id.toLowerCase() : id;

                // find user based on id
                User.findOne({ 'username': id }, function(err, foundUser) {
                    // if error occurred
                    if (err) {
                        // return error
                        return next(err);
                    }
                    // if draft was found
                    else if(foundUser) {
                        // compare equality
                        foundUser.comparePassword(req.body.oldpassword, function(err, isMatch) {
                            // if error occurred
                            if (err) {
                                // send internal error
                                res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err) });
                                console.log(clc.error(errorHandler.getDetailedErrorMessage(err)));
                            }
                            else if(!isMatch) {
                                // send not found
                                res.status(404).send({ title: errorHandler.getErrorTitle({ code: 404 }), message: 'Username/Password is incorrect.' });
                            }
                            else {
                                // bind the data to the request
                                req.foundUser = foundUser;
                                next();
                            }
                        });	
                    }
                    else {
                        // send not found
                        res.status(404).send({ title: errorHandler.getErrorTitle({ code: 404 }), message: 'Usernmae/Password is incorrect.' });
                    }
                });
            }
        });
    }
    else {
        // create forbidden error
        res.status(403).send({ title: errorHandler.getErrorTitle({ code: 403 }), message: errorHandler.getGenericErrorMessage({ code: 403 }) });
    }
};

// Generates random passphrase
function generateRandomPassphrase() {
    var password = '';
    var repeatingCharacters = new RegExp('(.)\\1{2,}', 'g');

    // iterate until the we have a valid passphrase
    // NOTE: Should rarely iterate more than once, but we need this to ensure no repeating characters are present
    while (password.length < 20 || repeatingCharacters.test(password)) {
        // build the random password
        password = generatePassword.generate({
            length: Math.floor(Math.random() * (20)) + 20, // randomize length between 20 and 40 characters
            numbers: true,
            symbols: false,
            uppercase: true,
            excludeSimilarCharacters: true
        });

        // check if we need to remove any repeating characters
        password = password.replace(repeatingCharacters, '');
    }

    // send the rejection back if the passphrase fails to pass the strength test
    if (owasp.test(password).errors.length) {
        return null;
    } 
    else {
        // return with the validated passphrase
        return password;
    }
}