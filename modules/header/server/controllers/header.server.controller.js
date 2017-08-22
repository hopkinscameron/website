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
    headerDetails = require('../data/header'),
    // the file details for the admin view
    headerAdminDetails = require('../data/header.admin');

/**
 * Show the current page
 */
exports.read = function (req, res) {
    // FIXME: maybe there is a better way to handle adding admin headers

    // if user is authenticated in the session get admin header
    if (req.isAuthenticated()) {
        // set authenticated
        headerAdminDetails.isLoggedIn = true;

        // send data
        res.json({ 'd': headerAdminDetails });
    }
    else {
        // send data
        res.json({ 'd': headerDetails });
    }
};