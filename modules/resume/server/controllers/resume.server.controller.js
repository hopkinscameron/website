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
    // the file details for this view
    resumeDetails = require('../data/resume');

/**
 * Show the current page
 */
exports.read = function (req, res) {
    // send data
    res.json({ 'd': resumeDetails });
};