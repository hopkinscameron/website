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

    // Define application route
    app.route('/*').get(core.renderIndex);

    // on get
    app.get('*', (req, res) => {
        res.sendFile(path.resolve('./modules/index.html'));
    });
    */

    // GET gets the application name
	// format /api/appName
    app.route('/api/appName').get(coreController.readAppName);

    // POST sends email
    // format /api/sendEmail
    app.route('/api/sendEmail').get(ipLogger.log, coreController.sendEmail);

    // POST shortens the url
    // format /api/shortenUrl
    app.route('/api/shortenUrl').get([ipLogger.log, corePolicy.isAllowed], coreController.shortenUrl);
};