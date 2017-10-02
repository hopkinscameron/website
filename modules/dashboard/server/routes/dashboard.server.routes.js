'use strict';

/**
 * Module dependencies
 */
var // the path
    path = require('path'),
    // the dashboard policy
	dashboardPolicy = require('../policies/dashboard.server.policy'),
    // the dashboard controller to handle routes
    dashboardController = require('../controllers/dashboard.server.controller');

module.exports = function (app) {
    // GET gets dashboard page information
	// format /api/dashboard
    app.route('/api/dashboard').get(dashboardPolicy.isAllowed, dashboardController.read);
};