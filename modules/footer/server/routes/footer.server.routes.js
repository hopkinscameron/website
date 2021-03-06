'use strict';

/**
 * Module dependencies
 */
var // the footer controller to handle routes
    footerController = require('../controllers/footer.server.controller');

module.exports = function (app) {
    // GET gets footer information
	// format /api/footer
    app.route('/api/footer').get(footerController.read);
};