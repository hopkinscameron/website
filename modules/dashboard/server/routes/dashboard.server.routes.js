'use strict';

/**
 * Module dependencies
 */
var // the path
    path = require('path'),
    // the ip logger
    ipLogger = require(path.resolve('./config/lib/ip-logger')),
    // the dashboard controller to handle routes
    dashboardController = require('../controllers/dashboard.server.controller');

module.exports = function (app) {
    // GET gets dashboard page information
	// format /api/dashboard
    app.route('/api/dashboard').get(ipLogger.log, dashboardController.read);
};