'use strict';

/**
 * Module dependencies
 */
var // the path
    path = require('path'),
    // the ip logger
    ipLogger = require(path.resolve('./config/lib/ip-logger')),
    // the home controller to handle routes
    homeController = require('../controllers/home.server.controller');

module.exports = function (app) {
    // GET gets home page information
	// format /api/home
    app.route('/api/home').get(ipLogger.log, homeController.read);
};