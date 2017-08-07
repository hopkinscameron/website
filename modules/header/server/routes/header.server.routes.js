'use strict';

/**
 * Module dependencies
 */
var // the header controller to handle routes
    headerController = require('../controllers/header.server.controller');

module.exports = function (app) {
    // GET get header information
	// format /api/header
    app.route('/api/header').get(headerController.read);
};