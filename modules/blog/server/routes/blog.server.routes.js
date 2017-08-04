'use strict';

/**
 * Module dependencies
 */
var // the blog controller to handle routes
    blogController = require('../controllers/blog.server.controller');

module.exports = function (app) {
	// TODO: in controller seperate out each query functionality
    // GET blog page information
	// format /api/blog
	// format /api/blog?q=someQuery
	// format /api/blog?id=postId
	// format /api/blog?page=pageNumber
	// format /api/blog?q=someQuery&page=pageNumber
    //app.route('/api/blog').get(blogController.read);
};