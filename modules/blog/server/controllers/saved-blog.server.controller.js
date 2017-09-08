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
    // the Saved Blog Post model
    SavedBlogPost = require(path.resolve('./modules/blog/server/models/model-saved-blog-post'));

/**
 * Show blog list
 */
exports.draftList = function (req, res) {
    // FIXME-MODELS: fix all mongo references
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
                // FIXME-MODELS: fix all mongo references
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
            var blogDraft = req.blogDraft;

            // FIXME-MODELS: fix all mongo references
            // create the blog
            var blogPost = new BlogPost({
                customShort: blogDraft.customShort,
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
                    // FIXME-MODELS: fix all mongo references
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

                            // FIXME-MODELS: fix all mongo references
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
    });
};

/**
 * Creates a new blog draft
 */
exports.createDraft = function (req, res) {
    // validate existence
    req.checkBody('title', 'Title is required').notEmpty();
    
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
            // set a possible id
            var postId = req.body.id;

            // if there is an id already attached (which means it was a blog that was being edited and now want to save a draft with the same customShort id)
            if(postId) {
                // check if id is valid
                if(shortid.isValid(postId)) {
                    // FIXME-MODELS: fix all mongo references
                    // create the blog
                    var savedBlog = new SavedBlogPost({
                        "customShort": postId,
                        "title": req.body.title,
                        "image": req.body.image,
                        "shortDescription": req.body.shortDescription,
                        "body": req.body.body
                    });

                    // FIXME-MODELS: fix all mongo references
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

                            // FIXME-MODELS: fix all mongo references
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

                // FIXME-MODELS: fix all mongo references
                // create the blog
                var savedBlog = new SavedBlogPost({
                    "customShort": shortId,
                    "title": req.body.title,
                    "image": req.body.image,
                    "shortDescription": req.body.shortDescription,
                    "body": req.body.body
                });

                // FIXME-MODELS: fix all mongo references
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

                        // FIXME-MODELS: fix all mongo references
                        // make an object
                        newSavedBlog = newSavedBlog.toObject({ hide: 'customShort', transform: true });
                        newSavedBlog.url = url;

                        // send success with blog data
                        res.json({ 'd': newSavedBlog });
                    }
                });
            }
        }
    });
};

/**
 * Shows the specific blog draft
 */
exports.readDraft = function (req, res) {
    // set draft from request
    var blogDraft = req.blogDraft;

    // set url
    var url = blogDraft.customShort;

    // FIXME-MODELS: fix all mongo references
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
            var blogDraft = req.blogDraft;

            // set updated values 
            var updatedValues = {
                "title": req.body.title,
                "image": req.body.image,
                "shortDescription": req.body.shortDescription,
                "body": req.body.body,
                "dateSaved": new Date()
            };

            // FIXME-MODELS: fix all mongo references
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

                    // FIXME-MODELS: fix all mongo references
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
    });    
};

/**
 * Delete the specific blog draft
 */
exports.deleteDraft = function (req, res) {
    // set draft from request
    var blogDraft = req.blogDraft;

    // FIXME-MODELS: fix all mongo references
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
    // FIXME-MODELS: fix all mongo references
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