'use strict';

/**
 * Module dependencies
 */
var // the path
    path = require('path'),
    // the error handler
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    // chalk for console logging
    clc = require(path.resolve('./config/lib/clc')),
    // short id generator
    shortid = require('shortid'),
    // the Blog Post model
    BlogPost = require(path.resolve('./modules/blog/server/models/model-blog-post')),
    // the Saved Blog Post model
    SavedBlogPost = require(path.resolve('./modules/blog/server/models/model-saved-blog-post')),
    // the Blog Post model
    AnalyticsBlogSearch = require(path.resolve('./modules/blog/server/models/model-analytics-blog-search'));

/**
 * Show blog list
 */
exports.blogList = function (req, res) {
    // holds the blog details
    var blogDetails = { };

    // set page number
    var pageNumber = req.query.page ? req.query.page : 1;

    // the options/search query
    var findOptions = req.query.q ? { $text: { $search: req.query.q } } : { };

    // if query
    if(req.query.q) {
        // log the blog search query
        logBlogSearchQuery(req.query.q);
    }

    // FIXME-MODELS: fix all mongo references
    // find all blog posts
    BlogPost.find(findOptions).exec(function(err, foundBlogs) {
        var pageSize = 1;

        // parse the page number
        pageNumber = parseInt(pageNumber);
        
        // set total pages
        blogDetails.totalPages = foundBlogs ? Math.ceil(foundBlogs.length/pageSize) : 0;

        // set current page
        blogDetails.currentPage = pageNumber;

        // if pages
        if(blogDetails.totalPages > 0) {
            // FIXME-MODELS: fix all mongo references
            // find all blog posts but limit based on page size
            BlogPost.find(findOptions).sort({ datePublished: 'desc' }).skip(pageSize * (pageNumber - 1)).limit(pageSize).exec(function(err, sortedPagedBlogs) {
                // map blogs to transform to an array of JSON
                blogDetails.posts = sortedPagedBlogs.map(function(blog) {
                    // get the url
                    var url = blog.customShort;

                    // make an object
                    blog = blog.toObject({ hide: 'customShort', transform: true });
                    blog.url = url;
                    return blog;
                });

                // send data
                res.json({ 'd': blogDetails });
            });
        }
        else {
            // set to empty
            blogDetails.posts = [];

            // send data
            res.json({ 'd': blogDetails });
        }
    });
};

/**
 * Publish new blog from scratch
 */
exports.publishBlogFromScratch = function (req, res) {
    // validate existence
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('shortDescription', 'Short Description is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();
    
    // validate errors
    req.getValidationResult().then(function(errors) {
        // if any errors exists
        if(!errors.isEmpty()) {
            // holds all the errors in one text
            var errorText = "";

            // add all the errors
            for(var x = 0; x < errors.array().length; x++) {
                // if not the last error
                if(x < errors.array().length - 1) {
                    errorText += errors.array()[x].msg + '\r\n';
                }
                else {
                    errorText += errors.array()[x].msg;
                }
            }

            // send bad request
            res.status(400).send({ title: errorHandler.getErrorTitle({ code: 400 }), message: errorText });
        }
        else {
            // generate a short id
            var shortId = shortid.generate();

            // FIXME-MODELS: fix all mongo references
            // create the blog
            var blogPost = new BlogPost({
                customShort: shortId,
                title: req.body.title,
                image: req.body.image,
                shortDescription: req.body.shortDescription,
                body: req.body.body
            });

            // FIXME-MODELS: fix all mongo references
            // save the blog
            blogPost.save(function(err, newPostedBlog) {
                // if error occurred
                if (err) {
                    // send internal error
                    res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err) });
                    console.log(clc.error(errorHandler.getDetailedErrorMessage(err)));
                }
                else {
                    // set url
                    var url = newPostedBlog.customShort;

                    // make an object
                    newPostedBlog = newPostedBlog.toObject({ hide: 'customShort', transform: true });
                    newPostedBlog.url = url;

                    // send success with blog data
                    res.json({ 'd': newPostedBlog });
                }
            });
        }
    });
};

/**
 * Show the specific blog
 */
exports.readBlog = function (req, res) {
    // get the blog from the request
    var blogPost = req.blogPost;

    // set url
    var url = blogPost.customShort;

    // FIXME-MODELS: fix all mongo references
    // make an object
    blogPost = blogPost.toObject({ hide: 'customShort', transform: true });
    blogPost.url = url;

    // send blog post
    res.json({ 'd': blogPost });
};

/**
 * Update the specific blog
 */
exports.updateBlog = function (req, res) {
    // validate existence
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('shortDescription', 'Short Description is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();
    
    // validate errors
    req.getValidationResult().then(function(errors) {
        // if any errors exists
        if(!errors.isEmpty()) {
            // holds all the errors in one text
            var errorText = "";

            // add all the errors
            for(var x = 0; x < errors.array().length; x++) {
                // if not the last error
                if(x < errors.array().length - 1) {
                    errorText += errors.array()[x].msg + '\r\n';
                }
                else {
                    errorText += errors.array()[x].msg;
                }
            }

            // send bad request
            res.status(400).send({ title: errorHandler.getErrorTitle({ code: 400 }), message: errorText });
        }
        else {
            // set draft from request
            var blogPost = req.blogPost;

            // set updated values 
            var updatedValues = {
                "title": req.body.title,
                "image": req.body.image,
                "shortDescription": req.body.shortDescription,
                "body": req.body.body,
                "dateUpdated": new Date()
            };

            // FIXME-MODELS: fix all mongo references
            // find the blog and remove
            blogPost.update(updatedValues).exec(function(err) {
                // if an error occurred
                if (err) {
                    // send internal error
                    res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err) });
                    console.log(clc.error(errorHandler.getDetailedErrorMessage(err)));
                }
                else {
                    // FIXME-MODELS: fix all mongo references
                    // see if there was a saved draft 
                    SavedBlogPost.findOneAndRemove({ customShort : blogPost.customShort }).exec(function(err) {
                        // if error occurred
                        if (err) {
                            // log error
                            console.log(clc.error(errorHandler.getDetailedErrorMessage(err)));
                        }

                        // set url
                        var url = blogPost.customShort;

                        // FIXME-MODELS: fix all mongo references
                        // make an object
                        blogPost = blogPost.toObject({ hide: 'customShort', transform: true });

                        // set all updated values
                        blogPost.url = url;
                        blogPost.title = updatedValues.title;
                        blogPost.image = updatedValues.image;
                        blogPost.shortDescription = updatedValues.shortDescription;
                        blogPost.body = updatedValues.body;
                        blogPost.dateUpdated = updatedValues.dateUpdated;

                        // send blog post
                        res.json({ 'd': blogPost });
                    });
                }
            });
        }
    });
};

/**
 * Delete the specific blog
 */
exports.deleteBlog = function (req, res) {
    // set draft from request
    var blogPost = req.blogPost;

    // FIXME-MODELS: fix all mongo references
    // remove blog post
    blogPost.remove(function(err) {
        // if an error occurred
        if (err) {
            // send internal error
            res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err) });
            console.log(clc.error(errorHandler.getDetailedErrorMessage(err)));
        }
        else {
            // FIXME-MODELS: fix all mongo references
            // see if there was saved draft of this same blog
            // find the draft and remove
            SavedBlogPost.findOneAndRemove({ customShort : req.blogPost.url }).exec(function(err, removedSavedBlog) {
                // if an error occurred
                if (err) {
                    console.log(clc.error(errorHandler.getDetailedErrorMessage(err)));
                }

                // return success
                res.status(200).send({ 'd': { title: errorHandler.getErrorTitle({ code: 200 }), message: errorHandler.getGenericErrorMessage({ code: 200 }) + " You have deleted the blog successfully!" } });
            });
        }
    });
};

/**
 * Blog middleware
 */
exports.blogByID = function (req, res, next, id) {
    // FIXME-MODELS: fix all mongo references
    // find blog post based on id
    BlogPost.findOne({ customShort : id }).exec(function(err, foundBlog) {
        // if error occurred
        if (err) {
            // return error
            return next(err);
        }
        // if blog was found
        else if(foundBlog) {
            // FIXME-MODELS: fix all mongo references
            // update the view count
            foundBlog.update({ $inc: { views: 1 } }).exec(function(err, updatedBlog) {
                // if error occurred
                if (err) {
                    // return error
                    return next(err);
                }
                else {
                    // if editing, don't increase the view count
                    if(!req.body.editing) {
                        // increase the view count since this model from the first 'find' isn't updated yet
                        foundBlog.views++;
                    }

                    // bind the data to the request
                    req.blogPost = foundBlog;
                    next();
                }
            });
        }
        else {
            // send not found
            res.status(404).send({ title: errorHandler.getErrorTitle({ code: 404 }), message: errorHandler.getGenericErrorMessage({ code: 404 }) + " Blog not found." });
        }
    });
};

/**
 * Logs the search query on the blog
 */
function logBlogSearchQuery(queryText) {
    // FIXME-MODELS: fix all mongo references
	// find search text by query text
	AnalyticsBlogSearch.findOne({ keyword : queryText.toLowerCase() }).exec(function(err, foundSearchText) {
		// if error occurred
		if (err) {
			console.log(clc.error(errorHandler.getDetailedErrorMessage(err)));
		}
		else if(foundSearchText) {
            // FIXME-MODELS: fix all mongo references
			// update the count
			foundSearchText.update({ $inc: { hits: 1 } }).exec(function(err) {
				// if error occurred
				if (err) {
					console.log(clc.error(err.message));
				}
			});
		}
		else {
            // FIXME-MODELS: fix all mongo references
			// create the analytics for search
			var blogSearch = new AnalyticsBlogSearch({
				keyword: queryText.toLowerCase()
			});

            // FIXME-MODELS: fix all mongo references
			// save
			blogSearch.save(function(err, newSearch) {
				if (err) {
					console.log(clc.error(err.message));
				}
			});
		}
	});
};