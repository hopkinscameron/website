'use strict';

/**
 * Module dependencies
 */
var // the portfolio controller to handle routes
    portfolioController = require('../controllers/portfolio.server.controller');

module.exports = function (app) {
    // TODO: in controller seperate out each query functionality
    // GET portfolio page information or subportfolio information
	// format /api/portfolio
	// format /api/portfolio?id=portfolioItemId
    //app.route('/api/portfolio').get(portfolioController.read);
};