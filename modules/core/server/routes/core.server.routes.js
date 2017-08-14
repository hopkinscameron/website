'use strict';

/**
 * Module dependencies.
 */
var // the path
    path = require('path'),
    // the ip logger
    ipLogger = require(path.resolve('./config/lib/ip.logger')),
    // the core policy
	corePolicy = require('../policies/core.server.policy'),
    // the core controller to handle routes
    coreController = require('../controllers/core.server.controller');

module.exports = function (app) {
    /*
    // Define error pages
    app.route('/server-error').get(core.renderServerError);

    // Return a 404 for all undefined api, module or lib routes
    app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);
    */

    // Define application route
    app.route('/*').get(coreController.renderIndex);

    // POST sends email
    // format /api/sendEmail
    app.route('/api/sendEmail').post(ipLogger.log, coreController.sendEmail);

    // POST shortens the url
    // format /api/shortenUrl
    app.route('/api/shortenUrl').post([ipLogger.log, corePolicy.isAllowed], coreController.shortenUrl);
};