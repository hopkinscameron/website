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
    // the file system to read/write from/to files locallly
    fs = require('fs'),
    // short id generator
    shortid = require('shortid'),
    // the mongoose
    mongoose = require('mongoose'),
    // load up the Blog Post model
    BlogPost = mongoose.model('BlogPost'),
    // load up the Saved Blog model
    SavedBlogPost = mongoose.model('SavedBlogPost'),
    // load up the Analytics Blog Search model
    AnalyticsBlogSearch = mongoose.model('AnalyticsBlogSearch');

// =========================================================================
// Blog Functions ==========================================================
// =========================================================================
/**
 * Show blog list
 */
exports.blogList = function (req, res) {
    // read file to gain information
    fs.readFile(path.resolve('./server/data/blog.json'), 'utf8', function (err, data) {
        // if error
        if(err) {
            // send internal error
            res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getErrorMessage(err) });
            console.log(clc.error(errorHandler.getErrorMessage(err)));
        }
        else {
            // holds the parsed json data
            var jsonParse = undefined;

            try {
                // parse json
                jsonParse = JSON.parse(data);

                // set page number
                var pageNumber = req.query.page ? req.query.page : 1;

                // the options/search query
                var findOptions = req.query.q ? { $text: {$search: req.query.q} } : {};

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
                    jsonParse.totalPages = foundBlogs ? Math.ceil(foundBlogs.length/pageSize) : 0;

                    // set current page
                    jsonParse.currentPage = pageNumber;

                    // if pages
                    if(jsonParse.totalPages > 0) {
                        // find all blog posts but limit based on page size
                        BlogPost.find(findOptions).sort({ datePublished: 'desc' }).skip(pageSize*(pageNumber-1)).limit(pageSize).exec(function(err, sortedPagedBlogs) {
                            // map blogs to transform to an array of JSON
                            jsonParse.posts = sortedPagedBlogs.map(function(blog) {
                                // get the url
                                var url = blog.customShort;

                                // make an object
                                blog = blog.toObject({ hide: 'customShort', transform: true });
                                blog.url = url;
                                return blog;
                            });

                            // send data
                            res.end(JSON.stringify(jsonParse));
                        });
                    }
                    else {
                        // set to empty
                        jsonParse.posts = [];

                        // send data
                        res.end(JSON.stringify(jsonParse));
                    }
                });
            }
            catch (err) {
                // send internal error
                res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getErrorMessage(err) });
                console.log(clc.error(errorHandler.getErrorMessage(err)));
            }
        }
    });
};

/**
 * Create new blog
 */
exports.createBlog = function (req, res) {
    // validate existence
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('shortDescription', 'Short Description is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();
    
    // validate errors
    var errors = req.validationErrors();

    // if errors exist
    if (errors) {
        // setup the 400 error
        var err = {
            code: 400
        };

        // holds all the errors in one text
        var errorText = "";

        // add all the errors
        for(var x = 0; x < errors.length; x++) {
            errorText += errors[x].msg + "\r\n";
        }

        // send bad request
        res.status(400).send({ title: errorHandler.getErrorTitle(err), message: errorHandler.getErrorMessage(err) + errorText });
    }
    else {
        // set post id
        var postId = req.body.id;
    }
};

/**
 * Show the specific blog
 */
exports.readBlog = function (req, res) {
    // send blog post
    res.end(JSON.stringify(req.blogPost));
};

/**
 * Update the specific blog
 */
exports.updateBlog = function (req, res) {
    // set updated values 
    var updatedValues = {
        "title": req.blogPost.title,
        "image": req.blogPost.image,
        "shortDescription": req.blogPost.shortDescription,
        "body": req.blogPost.body
    };

    // find the blog and remove
    BlogPost.findOneAndUpdate({ customShort : req.blogPost.url }, updatedValues).exec(function(err, updatedPostedBlog) {
        // if an error occurred
        if (err) {
            // send internal error
            res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getErrorMessage(err) });
            console.log(clc.error(errorHandler.getErrorMessage(err)));
        }
        else if(updatedPostedBlog) {
            // create the successful request
            var err = {
                code: 200
            };

            // return success
            res.status(200).send({ title: errorHandler.getErrorTitle(err), message: errorHandler.getErrorMessage(err) + " You have updated the blog successfully!" });
        }
        else {
            // create the bad request
            var err = {
                code: 400
            };

            // send bad request
            res.status(400).send({ title: errorHandler.getErrorTitle(err), message: errorHandler.getErrorMessage(err) + " Blog not found." });
        }
    });
};

/**
 * Delete the specific blog
 */
exports.deleteBlog = function (req, res) {
    // find the blog and remove
    BlogPost.findOneAndRemove({ customShort : req.blogPost.url }).exec(function(err, removedPostedBlog) {
        // if an error occurred
        if (err) {
            // send internal error
            res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getErrorMessage(err) });
            console.log(clc.error(errorHandler.getErrorMessage(err)));
        }
        else if(removedPostedBlog) {
            // see if there was saved draft of this same blog
            // find the draft and remove
            SavedBlogPost.findOneAndRemove({ customShort : req.blogPost.url }).exec(function(err, removedSavedBlog) {
                // if an error occurred
                if (err) {
                    console.log(clc.error(errorHandler.getErrorMessage(err)));
                }

                // create the successful request
                var err = {
                    code: 200
                };

                // return success
                res.status(200).send({ title: errorHandler.getErrorTitle(err), message: errorHandler.getErrorMessage(err) + " You have deleted the blog successfully!" });
            });
        }
        else {
            // create the bad request
            var err = {
                code: 400
            };

            // send bad request
            res.status(400).send({ title: errorHandler.getErrorTitle(err), message: errorHandler.getErrorMessage(err) + " Blog not found." });
        }
    });
};

/**
 * Blog middleware
 */
exports.blogByID = function (req, res, next, id) {
    // find blog post based on id
    BlogPost.findOne({ customShort : id }).exec(function(err, foundBlog) {
        // if error occured
        if (err) {
            // return error
            return next(err);
        }
        // if blog was found
        else if(foundBlog) {
            // set url
            var url = foundBlog.customShort;

            // make an object
            foundBlog = foundBlog.toObject({ hide: 'customShort', transform: true });
            foundBlog.url = url;
            foundBlog.views++;

            // update the view count
            BlogPost.update({ customShort : id }, { $inc: { views: 1 } }).exec(function(err, updatedBlog) {
                // if error occured
                if (err) {
                    // return error
                    return next(err);
                }
                else {
                    // bind the data to the request
                    req.blogPost = foundBlog;
                    next();
                }
            });
        }
        else {
            // create the not found error
            var err = {
                code: 404
            };

            // send not found
            res.status(404).send({ title: errorHandler.getErrorTitle(err), message: errorHandler.getErrorMessage(err) + " Blog not found." });
        }
    });
};

/**
 * Logs the search query on the blog
 */
function logBlogSearchQuery(queryText) {
	// find search text by query text
	AnalyticsBlogSearch.findOne({ keyword : queryText.toLowerCase() }).exec(function(err, foundSearchText) {
		// if error occured
		if (err) {
			console.log(clc.error(errorHandler.getErrorMessage(err)));
		}
		else if(foundSearchText) {
			// push the ip who accessed this page
			AnalyticsBlogSearch.update({ keyword : queryText.toLowerCase() }, { $inc: { hits: 1 } }).exec(function(err, updatedSearchText) {
				// if error occured
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
        // if error occured
        if (err) {
            // send internal error
            res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getErrorMessage(err) });
            console.log(clc.error(errorHandler.getErrorMessage(err)));
        }
        // if drafts were found
        else if(drafts) {
            // map drafts to transform to an array of JSON
            drafts = drafts.map(function(draft) {
                return draft.toObject({ hide: 'customShort', transform: true });
            });

            // send drafts back
            res.end(JSON.stringify({ "savedPosts": drafts }));
        }
        else {
            // create the not found error
            var err = {
                code: 404
            };

            // send not found
            res.status(404).send({ title: errorHandler.getErrorTitle(err), message: errorHandler.getErrorMessage(err) + " Blog drafts not found." });
        }
    });
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
        // setup the 400 error
        var err = {
            code: 400
        };

        // holds all the errors in one text
        var errorText = "";

        // add all the errors
        for(var x = 0; x < errors.length; x++) {
            errorText += errors[x].msg + "\r\n";
        }

        // send bad request
        res.status(400).send({ title: errorHandler.getErrorTitle(err), message: errorHandler.getErrorMessage(err) + errorText });
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
            // if error occured
            if (err) {
                // send internal error
                res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getErrorMessage(err) });
                console.log(clc.error(errorHandler.getErrorMessage(err)));
            }
            else {
                // set url
                var url = newSavedBlog.customShort;

                // make an object
                newSavedBlog = newSavedBlog.toObject({ hide: 'customShort', transform: true });
                newSavedBlog.url = url;

                // send success with blog data
                res.end( JSON.stringify(newSavedBlog) );
            }
        });
    }
};

/**
 * Shows the specific blog draft
 */
exports.readDraft = function (req, res) {
    // send blog post
    res.end(JSON.stringify(req.blogDraft));
};

/**
 * Updates the specific blog draft
 */
exports.updateDraft = function (req, res) {
    // set updated values 
    var updatedValues = {
        "title": req.blogDraft.title,
        "image": req.blogDraft.image,
        "shortDescription": req.blogDraft.shortDescription,
        "body": req.blogDraft.body
    };
    
    // find the blog draft and update
    SavedBlogPost.findOneAndUpdate({ customShort : req.blogDraft.url }, updatedValues).exec(function(err, updatedSavedBlog) {
        // if error occured
        if (err) {
            // send internal error
            res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getErrorMessage(err) });
            console.log(clc.error(errorHandler.getErrorMessage(err)));
        }	
        // if saved blog found
        else if(updatedSavedBlog) {
            // set url
            var url = updatedSavedBlog.customShort;

            // make an object
            updatedSavedBlog = updatedSavedBlog.toObject({ hide: 'customShort', transform: true });
            updatedSavedBlog.url = url;

            // send success with blog data
            res.end(JSON.stringify(updatedSavedBlog));
        }
        else {
            // create the not found error
            var err = {
                code: 404
            };

            // send not found
            res.status(404).send({ title: errorHandler.getErrorTitle(err), message: errorHandler.getErrorMessage(err) + " Blog draft not found." });
        }
    });
};

/**
 * Delete the specific blog draft
 */
exports.deleteDraft = function (req, res) {
    // find the blog and remove
    SavedBlogPost.findOneAndRemove({ customShort : req.blogDraft.url }).exec(function(err, removedSavedBlog) {
        // if an error occurred
        if (err) {
            // send internal error
            res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getErrorMessage(err) });
            console.log(clc.error(errorHandler.getErrorMessage(err)));
        }
        else if(removedSavedBlog) {
            // create the successful request
            var err = {
                code: 200
            };

            // return success
            res.status(200).send({ title: errorHandler.getErrorTitle(err), message: errorHandler.getErrorMessage(err) + " You have discarded the saved post successfully!" });
        }
        else {
            // create the bad request
            var err = {
                code: 400
            };

            // send bad request
            res.status(400).send({ title: errorHandler.getErrorTitle(err), message: errorHandler.getErrorMessage(err) + " Blog draft not found." });
        }
    });
};

/**
 * Blog Draft middleware
 */
exports.draftBlogByID = function (req, res, next, id) {
    // find saved blog post based on id
    SavedBlogPost.findOne({ customShort : id }).exec(function(err, foundDraft) {
        // if error occured
        if (err) {
            // return error
            return next(err);
        }
        // if draft was found
        else if(foundDraft) {
            // set url
            var url = foundDraft.customShort;

            // make an object
            foundDraft = foundDraft.toObject({ hide: 'customShort', transform: true });
            foundDraft.url = url;

            // bind the data to the request
            req.blogDraft = foundDraft;
            next();
        }
        else {
            // create the not found error
            var err = {
                code: 404
            };

            // send not found
            res.status(404).send({ title: errorHandler.getErrorTitle(err), message: errorHandler.getErrorMessage(err) + " Blog draft not found." });
        }
    });
};