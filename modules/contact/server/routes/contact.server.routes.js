'use strict';

/**
 * Module dependencies
 */
var // the path
    path = require('path'),
    // the ip logger
    ipLogger = require(path.resolve('./config/lib/ip-logger')),
    // the contact controller to handle routes
    contactController = require('../controllers/contact.server.controller');

module.exports = function (app) {
    // GET gets contact page information
	// format /api/contact
    app.route('/api/contact').get(ipLogger.log, contactController.read);
};