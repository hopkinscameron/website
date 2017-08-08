'use strict';

var // the path
    path = require('path'),
    // get the current config
	environmentConfig = require(path.join(process.cwd(), 'config/env/', process.env.NODE_ENV)) || {},
    // the error handler
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    // chalk for console logging
    clc = require(path.resolve('./config/lib/clc')),
    // the file system to read/write from/to files locallly
    fs = require('fs'),
    // the ability to send emails
    nodemailer = require('nodemailer'),
    // the ability to create requests/promises
    requestPromise = require('request-promise');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: environmentConfig.mailer.options.host,
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: environmentConfig.mailer.options.auth.user,
        pass: environmentConfig.mailer.options.auth.pass
    },
	proxy: 'http://localhost:3128',
	service: environmentConfig.mailer.options.service
});

/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
    
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
    });
};

/**
 * Show the current page
 */
exports.readAppName = function (req, res) {
    // read file to gain information
    fs.readFile("./server/data/app-details.json", 'utf8', function (err, data) {
        // if error 
        if(err) {
            // send internal error
            res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err) });
            console.log(clc.error(errorHandler.getDetailedErrorMessage(err)));
        }
        else {
            var appName = "";
            var jsonParse = undefined;

            // parse json
            try {
                jsonParse = JSON.parse(data);

                // if appname exists
                if(jsonParse.appName) {
                    appName = jsonParse.appName;
                }
                else {
                    appName = "Cameron Hopkins";					
                }

                // send data
                res.end(JSON.stringify({ "appName": appName }));
            }
            catch (err) {
                // send internal error
                res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err) });
                console.log(clc.error(errorHandler.getDetailedErrorMessage(err)));
            }
        }
    });
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
    var errors = req.validationErrors();

    // if errors exist
    if (errors) {
        // setup the 400 error
        var err = {
            code: 400
        };

        // holds all the errors in one text
        var errorText = "";

        // add all the errors
        for(var x = 0; x < errors.length; x++) {
            errorText += errors[x].msg + "\r\n";
        }

        // send bad request
        res.status(400).send({ title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err) + errorText });
    }
    else {
        var fromString = req.body.firstName + " " + req.body.lastName + "<" + req.body.email + ">";
        
        // setup email data with unicode symbols
        let mailOptions = {
            from: fromString, // sender address
            to: environmentConfig.mailer.options.auth.user, // list of receivers
            subject: req.body.subject, // Subject line
            text: req.body.message, // plain text body
            html: '<p>' + req.body.message + '</p>' // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (err, info) => {
            // if an internal error occured
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
                res.status(200).send({ title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err) + " Your email has been sent!" });
            }
        });		
    }
};

/**
 * Shortens the URL
 */
exports.shortenUrl = function (req, res) {
    // validate existence
    req.checkBody('longUrl', 'Long url is required').notEmpty();

    // validate errors
    var errors = req.validationErrors();

    // if errors exist
    if (errors) {
        // setup the 400 error
        var err = {
            code: 400
        };

        // holds all the errors in one text
        var errorText = "";

        // add all the errors
        for(var x = 0; x < errors.length; x++) {
            errorText += errors[x].msg + "\r\n";
        }

        // send bad request
        res.status(400).send({ title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err) + errorText });
    }
    else {
        // create request
        var options = {
            method: 'POST',
            uri: "https://www.googleapis.com/urlshortener/v1/url?key=" + environmentConfig.googleShortenUrl.clientSecret,
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
            res.end(returnReq);
        }).catch(function (responseSU) {
            // send internal error
            res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err)  });
            console.log(clc.error(errorHandler.getDetailedErrorMessage(err)));
        });
    }
};