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
    // the file system to read/write from/to files locallly
    fs = require('fs');

/**
 * Show the current page
 */
exports.read = function (req, res) {
    // TODO: maybe there is a better way to handle adding admin headers
    // header file will either be normal or admin header file
    var headerFile = './server/data/header.json';

    // determines if authenticated
    var auth = false;

    // if user is authenticated in the session get admin header
    if (req.isAuthenticated()) {
        // set the admin header file and set authenticated
        headerFile = './server/data/header_admin.json';
        auth = true;
    }
        
    // read file to gain information
    fs.readFile(path.resolve(headerFile), 'utf8', function (err, data) {
        // if error
        if(err) {
            // send internal error
            res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err) });
            console.log(clc.error(errorHandler.getDetailedErrorMessage(err)));
        }
        else {
            // if authenticated
            if(auth) {
                // the parsed data
                var parsedData = null;

                try {
                    // parse data
                    parsedData = JSON.parse(data);

                    // set authenticated
                    parsedData.isLoggedIn = true;

                    // send data
                    res.end( JSON.stringify(parsedData) );
                }
                catch (err) {
                    // send internal error
                    res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message  });
                    console.log(clc.error(err.message));
                }
            }
            else {
                // send data
                res.end(data);
            }
        }
    });
};