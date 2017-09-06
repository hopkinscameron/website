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
    shortid = require('shortid');

// FIXME-MODELS: fix all mongo references and delete all models
// =========================================================================
// Blog Functions ==========================================================
// =========================================================================
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
    var errors = req.validationErrors();

    // if errors exist
    if (errors) {
        // holds all the errors in one text
        var errorText = "";

        // add all the errors
        for(var x = 0; x < errors.length; x++) {
            errorText += errors[x].msg + "\r\n";
        }

        // send bad request
        res.status(400).send({ title: errorHandler.getErrorTitle({ code: 400 }), message: errorHandler.getGenericErrorMessage({ code: 400 }) + errorText });
    }
    else {
        // generate a short id
        var shortId = shortid.generate();

        // create the blog
        var blogPost = new BlogPost({
            customShort: shortId,
            title: req.body.title,
            image: req.body.image,
            shortDescription: req.body.shortDescription,
            body: req.body.body
        });

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
};

/**
 * Show the specific blog
 */
exports.readBlog = function (req, res) {
    // get the blog from the request
    var blogPost = req.blogPost;

    // set url
    var url = blogPost.customShort;

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
    var errors = req.validationErrors();

    // if errors exist
    if (errors) {
        // holds all the errors in one text
        var errorText = "";

        // add all the errors
        for(var x = 0; x < errors.length; x++) {
            errorText += errors[x].msg + "\r\n";
        }

        // send bad request
        res.status(400).send({ title: errorHandler.getErrorTitle({ code: 400 }), message: errorHandler.getGenericErrorMessage({ code: 400 }) + errorText });
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

        // find the blog and remove
        blogPost.update(updatedValues).exec(function(err) {
            // if an error occurred
            if (err) {
                // send internal error
                res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err) });
                console.log(clc.error(errorHandler.getDetailedErrorMessage(err)));
            }
            else {
                // see if there was a saved draft 
                SavedBlogPost.findOneAndRemove({ customShort : blogPost.customShort }).exec(function(err) {
                    // if error occurred
                    if (err) {
                        // log error
                        console.log(clc.error(errorHandler.getDetailedErrorMessage(err)));
                    }

                    // set url
                    var url = blogPost.customShort;

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
};

/**
 * Delete the specific blog
 */
exports.deleteBlog = function (req, res) {
    // set draft from request
    var blogPost = req.blogPost;

    // remove blog post
    blogPost.remove(function(err) {
        // if an error occurred
        if (err) {
            // send internal error
            res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err) });
            console.log(clc.error(errorHandler.getDetailedErrorMessage(err)));
        }
        else {
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
    // find blog post based on id
    BlogPost.findOne({ customShort : id }).exec(function(err, foundBlog) {
        // if error occurred
        if (err) {
            // return error
            return next(err);
        }
        // if blog was found
        else if(foundBlog) {
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
	// find search text by query text
	AnalyticsBlogSearch.findOne({ keyword : queryText.toLowerCase() }).exec(function(err, foundSearchText) {
		// if error occurred
		if (err) {
			console.log(clc.error(errorHandler.getDetailedErrorMessage(err)));
		}
		else if(foundSearchText) {
			// update the count
			foundSearchText.update({ $inc: { hits: 1 } }).exec(function(err) {
				// if error occurred
				if (err) {
					console.log(clc.error(err.message));
				}
			});
		}
		else {
			// create the analytics for searc
			var blogSearch = new AnalyticsBlogSearch({
				keyword: queryText.toLowerCase()
			});

			// save
			blogSearch.save(function(err, newSearch) {
				if (err) {
					console.log(clc.error(err.message));
				}
			});
		}
	});
};

// =========================================================================
// Draft Functions ==========================================================
// =========================================================================

/**
 * Show blog list
 */
exports.draftList = function (req, res) {
    // find all saved draft posts
    SavedBlogPost.find({}).sort({ dateSaved: 'desc' }).exec(function(err, drafts) {
        // if error occurred
        if (err) {
            // send internal error
            res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err) });
            console.log(clc.error(errorHandler.getDetailedErrorMessage(err)));
        }
        // if drafts were found
        else if(drafts) {
            // map drafts to transform to an array of JSON
            drafts = drafts.map(function(draft) {
                return draft.toObject({ hide: 'customShort', transform: true });
            });

            // send drafts back
            res.json({ 'd': { "savedPosts": drafts } });
        }
        else {
            // send not found
            res.status(404).send({ title: errorHandler.getErrorTitle({ code: 404 }), message: errorHandler.getGenericErrorMessage({ code: 404 }) + " Blog drafts not found." });
        }
    });
};

/**
 * Publish new blog from draft
 */
exports.publishBlogFromDraft = function (req, res) {
    // validate existence
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('shortDescription', 'Short Description is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();
    
    // validate errors
    var errors = req.validationErrors();

    // if errors exist
    if (errors) {
        // holds all the errors in one text
        var errorText = "";

        // add all the errors
        for(var x = 0; x < errors.length; x++) {
            errorText += errors[x].msg + "\r\n";
        }

        // send bad request
        res.status(400).send({ title: errorHandler.getErrorTitle({ code: 400 }), message: errorHandler.getGenericErrorMessage({ code: 400 }) + errorText });
    }
    else {
        // set draft from request
        var blogDraft = req.blogDraft;

        // create the blog
        var blogPost = new BlogPost({
            customShort: blogDraft.customShort,
            title: req.body.title,
            image: req.body.image,
            shortDescription: req.body.shortDescription,
            body: req.body.body
        });

        // save the blog
        blogPost.save(function(err, newPostedBlog) {
            // if error occurred
            if (err) {
                // send internal error
                res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err) });
                console.log(clc.error(errorHandler.getDetailedErrorMessage(err)));
            }
            else {
                // remove draft
                blogDraft.remove(function(err, removedSavedBlog) {
                    // if an error occurred
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
    }
};

/**
 * Creates a new blog draft
 */
exports.createDraft = function (req, res) {
    // validate existence
    req.checkBody('title', 'Title is required').notEmpty();
    
    // validate errors
    var errors = req.validationErrors();

    // if errors exist
    if (errors) {
        // holds all the errors in one text
        var errorText = "";

        // add all the errors
        for(var x = 0; x < errors.length; x++) {
            errorText += errors[x].msg + "\r\n";
        }

        // send bad request
        res.status(400).send({ title: errorHandler.getErrorTitle({ code: 400 }), message: errorHandler.getGenericErrorMessage({ code: 400 }) + errorText });
    }
    else {
        // set a possible id
        var postId = req.body.id;

        // if there is an id already attached (which means it was a blog that was being edited and now want to save a draft with the same customShort id)
        if(postId) {
            // check if id is valid
            if(shortid.isValid(postId)) {
                // create the blog
                var savedBlog = new SavedBlogPost({
                    "customShort": postId,
                    "title": req.body.title,
                    "image": req.body.image,
                    "shortDescription": req.body.shortDescription,
                    "body": req.body.body
                });

                // save the blog
                savedBlog.save(function(err, newSavedBlog) {
                    // if error occurred
                    if (err) {
                        // send internal error
                        res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err) });
                        console.log(clc.error(errorHandler.getDetailedErrorMessage(err)));
                    }
                    else {
                        // set url
                        var url = newSavedBlog.customShort;

                        // make an object
                        newSavedBlog = newSavedBlog.toObject({ hide: 'customShort', transform: true });
                        newSavedBlog.url = url;

                        // send success with blog data
                        res.json({ 'd': newSavedBlog });
                    }
                });
            }
            else {
                // send bad request
                res.status(400).send({ title: errorHandler.getErrorTitle({ code: 400 }), message: errorHandler.getGenericErrorMessage({ code: 400 }) + " Invalid Blog Post Id." });
            }
        }
        else {
            // generate a short id
            var shortId = shortid.generate();

            // create the blog
            var savedBlog = new SavedBlogPost({
                "customShort": shortId,
                "title": req.body.title,
                "image": req.body.image,
                "shortDescription": req.body.shortDescription,
                "body": req.body.body
            });

            // save the blog
            savedBlog.save(function(err, newSavedBlog) {
                // if error occurred
                if (err) {
                    // send internal error
                    res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err) });
                    console.log(clc.error(errorHandler.getDetailedErrorMessage(err)));
                }
                else {
                    // set url
                    var url = newSavedBlog.customShort;

                    // make an object
                    newSavedBlog = newSavedBlog.toObject({ hide: 'customShort', transform: true });
                    newSavedBlog.url = url;

                    // send success with blog data
                    res.json({ 'd': newSavedBlog });
                }
            });
        }
    }
};

/**
 * Shows the specific blog draft
 */
exports.readDraft = function (req, res) {
    // set draft from request
    var blogDraft = req.blogDraft;

    // set url
    var url = blogDraft.customShort;

    // make an object
    blogDraft = blogDraft.toObject({ hide: 'customShort', transform: true });
    blogDraft.url = url;

    // send blog draft
    res.json({ 'd': blogDraft });
};

/**
 * Updates the specific blog draft
 */
exports.updateDraft = function (req, res) {
    // validate existence
    req.checkBody('title', 'Title is required').notEmpty();
    
    // validate errors
    var errors = req.validationErrors();

    // if errors exist
    if (errors) {
        // holds all the errors in one text
        var errorText = "";

        // add all the errors
        for(var x = 0; x < errors.length; x++) {
            errorText += errors[x].msg + "\r\n";
        }

        // send bad request
        res.status(400).send({ title: errorHandler.getErrorTitle({ code: 400 }), message: errorHandler.getGenericErrorMessage({ code: 400 }) + errorText });
    }
    else {
        // set draft from request
        var blogDraft = req.blogDraft;

        // set updated values 
        var updatedValues = {
            "title": req.body.title,
            "image": req.body.image,
            "shortDescription": req.body.shortDescription,
            "body": req.body.body,
            "dateSaved": new Date()
        };

        // update blog draft
        blogDraft.update(updatedValues).exec(function(err) {
            // if error occurred
            if (err) {
                // send internal error
                res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err) });
                console.log(clc.error(errorHandler.getDetailedErrorMessage(err)));
            }
            else {
                // set url
                var url = blogDraft.customShort;

                // make an object
                blogDraft = blogDraft.toObject({ hide: 'customShort', transform: true });

                // set all updated values
                blogDraft.url = url;
                blogDraft.title = updatedValues.title;
                blogDraft.image = updatedValues.image;
                blogDraft.shortDescription = updatedValues.shortDescription;
                blogDraft.body = updatedValues.body;
                blogDraft.dateSaved = updatedValues.dateSaved;

                // send success with blog data
                res.json({ 'd': blogDraft });
            }
        });
    }
};

/**
 * Delete the specific blog draft
 */
exports.deleteDraft = function (req, res) {
    // set draft from request
    var blogDraft = req.blogDraft;

    // remove draft
    blogDraft.remove(function(err) {
        // if an error occurred
        if (err) {
            // send internal error
            res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err) });
            console.log(clc.error(errorHandler.getDetailedErrorMessage(err)));
        }
        else {
            // return success
            res.status(200).send({ 'd': { title: errorHandler.getErrorTitle({ code: 200 }), message: errorHandler.getGenericErrorMessage({ code: 200 }) + " You have discarded the saved post successfully!" } });
        }
    });
};

/**
 * Blog Draft middleware
 */
exports.draftBlogByID = function (req, res, next, id) {
    // find saved blog post based on id
    SavedBlogPost.findOne({ customShort : id }).exec(function(err, foundDraft) {
        // if error occurred
        if (err) {
            // return error
            return next(err);
        }
        // if draft was found
        else if(foundDraft) {
            // bind the data to the request
            req.blogDraft = foundDraft;
            next();
        }
        else {
            // if editing an already posted blog, send back empty response
            if(req.query.editing == 'true') {
                // send not found
                res.status(200).send({ 'd': { error: true, title: errorHandler.getErrorTitle({ code: 404 }), message: errorHandler.getGenericErrorMessage({ code: 404 }) + " Blog draft not found." } });
            }
            else {
                // send not found
                res.status(404).send({ title: errorHandler.getErrorTitle({ code: 404 }), message: errorHandler.getGenericErrorMessage({ code: 404 }) + " Blog draft not found." });
            }
        }
    });
};