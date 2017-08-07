'use strict';

/**
 * Module dependencies
 */
var // the path
    path = require('path'),
    // the ip logger
    ipLogger = require(path.resolve('./config/lib/ip.logger')),
    // the resume controller to handle routes
    resumeController = require('../controllers/resume.server.controller');

module.exports = function (app) {
    // GET gets resume page information
	// format /api/resume
    app.route('/api/resume').get(ipLogger.log, resumeController.read);
};