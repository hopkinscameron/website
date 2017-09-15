'use strict';

var // the path
    path = require('path'),
    // get the current config
	config = require(path.resolve('./config/config')),
    // the error handler
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    // chalk for console logging
    clc = require(path.resolve('./config/lib/clc')),
    // the ability to send emails
    nodemailer = require('nodemailer'),
    // the ability to create requests/promises
    requestPromise = require('request-promise'),
    // for validators and sanitizers
    validator = require('validator');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: config.mailer.options.host,
    port: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'developmentp' ? 465 : 587,
    secure: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'developmentp' ? true : false, // secure:true for port 465, secure:false for port 587
    auth: {
        user: config.mailer.options.auth.user,
        pass: config.mailer.options.auth.pass
    },
	//proxy: 'http://localhost:3128',
	service: config.mailer.options.service
});

/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
    // get the index file path
    var indexFilePath = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'developmentp' ? 'modules/core/server/index/index' : 'modules/core/server/views/index'

    // define the safe user object
    var safeUserObject = null;

    // if a user is logged in
    if (req.user) {
        // create the safe object
        safeUserObject = {
            username: validator.escape(req.user.username)
        };
    }

    // render the main index
    res.render(indexFilePath, {
        user: JSON.stringify(safeUserObject),
        sharedConfig: JSON.stringify(config.shared)
    });
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
    res.status(500).render('modules/core/server/views/500', {
        error: 'Oops! Something went wrong...'
    });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {
    /*
    res.status(404).format({
    'text/html': function () {
            res.render('modules/core/server/views/404', {
            url: req.originalUrl
        });
    },
    'application/json': function () {
        res.json({
            error: 'Path not found'
        });
    },
    'default': function () {
            res.send('Path not found');
        }
    });*/
    
    // redirect to not found
    res.redirect('/not-found');
};

/**
 * Sends an email to owner
 */
exports.sendEmail = function (req, res) {
    // validate existence
    req.checkBody('firstName', 'First name is required').notEmpty();
    req.checkBody('lastName', 'Last name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('subject', 'Subject is required').notEmpty();
    req.checkBody('message', 'Message is required').notEmpty();

    // validate errors
    req.getValidationResult().then(function(errors) {
        // if any errors exists
        if(!errors.isEmpty()) {
            // holds all the errors in one text
            var errorText = "";

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
            var fromString = req.body.firstName + " " + req.body.lastName + "<" + req.body.email + ">";
            
            // setup email data with unicode symbols
            let mailOptions = {
                from: fromString, // sender address
                to: config.mailer.options.auth.user, // list of receivers
                subject: req.body.subject, // Subject line
                text: req.body.message, // plain text body
                html: '<p>' + req.body.message + '</p>' // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (err, info) => {
                // if error occurred
                if (err) {
                    // send internal error
                    res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err) });
                    console.log(clc.error(errorHandler.getDetailedErrorMessage(err)));
                }
                else {
                    // setup success
                    var err = {
                        code: 200
                    };

                    // return success
                    res.status(200).send({ 'd': { title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err) + " Your email has been sent!" } });
                }
            });		
        }
    });
};

/**
 * Shortens the URL
 */
exports.shortenUrl = function (req, res) {
    // validate existence
    req.checkBody('longUrl', 'Long url is required').notEmpty();

    // validate errors
    req.getValidationResult().then(function(errors) {
        // if any errors exists
        if(!errors.isEmpty()) {
            // holds all the errors in one text
            var errorText = "";

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
            // create request
            var options = {
                method: 'POST',
                uri: "https://www.googleapis.com/urlshortener/v1/url?key=" + config.googleShortenUrl.clientSecret,
                headers: {
                    'Content-Type': 'application/json; odata=verbose',
                    'Accept': 'application/json; odata=verbose'
                },
                body: {
                    "longUrl": req.body.longUrl
                },
                json: true
            };

            // submit request
            requestPromise(options).then(function (responseSU) {
                // create return response
                var returnReq = JSON.stringify({
                    "shortUrl": responseSU.id,
                    "longUrl": responseSU.longUrl
                });

                // send data
                res.json({ 'd': returnReq });
            }).catch(function (responseSU) {
                // send internal error
                res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err)  });
                console.log(clc.error(errorHandler.getDetailedErrorMessage(err)));
            });
        }
    });
};

/**
 * Testing basic response
 */
exports.testBasicHelloWorld = function (req, res) {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end("Hello World!");
};