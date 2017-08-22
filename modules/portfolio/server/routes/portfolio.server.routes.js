'use strict';

/**
 * Module dependencies
 */
var // the path
    path = require('path'),
    // the ip logger
	ipLogger = require(path.resolve('./config/lib/ip.logger')),
    // the portfolio controller to handle routes
    portfolioController = require('../controllers/portfolio.server.controller');

module.exports = function (app) {
    // GET gets portfolio list
	// format /api/portfolio
    app.route('/api/portfolio').get(ipLogger.log, portfolioController.list);

    // single blog routes
	// GET gets specific portfolio item
	// format /api/portfolio/:portfolioItemId
    app.route('/api/portfolio/:portfolioItemId').get(ipLogger.log, portfolioController.read)
    
    // if portfolio item id exists, bind the portfolio item by id middleware
	app.param('portfolioItemId', portfolioController.portfolioItemByID);
};