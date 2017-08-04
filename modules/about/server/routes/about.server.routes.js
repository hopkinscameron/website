'use strict';

/**
 * Module dependencies
 */
var // the path
    path = require('path'),
    // the ip logger
    ipLogger = require(path.resolve('./config/lib/ip.logger')),
    // the about controller to handle routes
    aboutController = require('../controllers/about.server.controller');

module.exports = function (app) {
    // GET about page information
	// format /api/about
    app.route('/api/about').get(ipLogger.log, aboutController.read);
};