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
    // read file to gain information
    fs.readFile(path.resolve('./server/data/footer.json'), 'utf8', function (err, data) {
        // if error
        if(err) {
            // send internal error
            res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getErrorMessage(err) });
            console.log(clc.error(errorHandler.getErrorMessage(err)));
        }
        else {
            // send data
            res.end(data);
        }
    });
};