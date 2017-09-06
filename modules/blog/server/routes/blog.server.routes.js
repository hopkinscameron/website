'use strict';

/**
 * Module dependencies
 */
var // the path
    path = require('path'),
    // the ip logger
	ipLogger = require(path.resolve('./config/lib/ip-logger')),
	// the blog policy
	blogPolicy = require('../policies/blog.server.policy'),
	// the blog controller to handle routes
    blogController = require('../controllers/blog.server.controller');

module.exports = function (app) {
	// =========================================================================
    // Blog Routes =============================================================
	// =========================================================================
	
	// GET gets blog list
	// POST creates new blog from scratch
	// format /api/blog
	// format /api/blog?q=someQuery
	// format /api/blog?page=pageNumber
	// format /api/blog?q=someQuery&page=pageNumber
	app.route('/api/blog').get(ipLogger.log, blogController.blogList)
		.post([ipLogger.log, blogPolicy.isAllowed], blogController.publishBlogFromScratch);
	
	// single blog routes
	// GET gets specific blog
	// POST gets specific blog to be edited
	// PUT updates specific blog
	// DELETE deletes specific blog
	// format /api/blog/:blogId
	app.route('/api/blog/:blogId').get(ipLogger.log, blogController.readBlog)
		.post([ipLogger.log, blogPolicy.isAllowed], blogController.readBlog)
		.put([ipLogger.log, blogPolicy.isAllowed], blogController.updateBlog)
		.delete([ipLogger.log, blogPolicy.isAllowed], blogController.deleteBlog);

	// if blog id exists, bind the blog by id middleware
	app.param('blogId', blogController.blogByID);

	// =========================================================================
    // Draft Routes =============================================================
	// =========================================================================

	// GET gets blog drafts list
	// POST creates new blog draft
	// format /api/blogDrafts
	app.route('/api/blogDrafts').get([ipLogger.log, blogPolicy.isAllowed], blogController.draftList)
		.post([ipLogger.log, blogPolicy.isAllowed], blogController.createDraft);

	// single blog draft routes
	// GET gets specific draft
	// POST creates new blog from the draft
	// PUT updates specific draft
	// DELETE deletes specific draft
	// format /api/blogDrafts/:draftBlogId
	app.route('/api/blogDrafts/:draftBlogId').get([ipLogger.log, blogPolicy.isAllowed], blogController.readDraft)
		.post([ipLogger.log, blogPolicy.isAllowed], blogController.publishBlogFromDraft)
		.put([ipLogger.log, blogPolicy.isAllowed], blogController.updateDraft)
		.delete([ipLogger.log, blogPolicy.isAllowed], blogController.deleteDraft);
	  
	// if draft blog id exists, bind the draft blog by id middleware
	app.param('draftBlogId', blogController.draftBlogByID);
};