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
    SavedBlogPost = require(path.resolve('./modules/blog/server/models/model-saved-blog-post'));

/**
 * Show blog list
 */
exports.draftList = function (req, res) {
    // find all saved draft posts
    SavedBlogPost.find({}, function(err, drafts) {
        // sort drafts
        SavedBlogPost.sort(drafts, { 'dateSaved': 'desc' }, function(err, sortedDrafts) {
            // if error occurred
            if (err) {
                // send internal error
                res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err) });
                console.log(clc.error(errorHandler.getDetailedErrorMessage(err)));
            }
            // if drafts were found
            else if(sortedDrafts) {
                // map drafts to transform to an array of JSON
                sortedDrafts = sortedDrafts.map(function(draft) {
                    // set url
                    var url = draft.customShort;

                    // make an object
                    draft = SavedBlogPost.toObject(draft, { 'hide': 'customShort' });
                    draft.url = url;

                    return draft;
                });

                // send drafts back
                res.json({ 'd': { 'savedPosts': sortedDrafts } });
            }
            else {
                // send not found
                res.status(404).send({ title: errorHandler.getErrorTitle({ code: 404 }), message: errorHandler.getGenericErrorMessage({ code: 404 }) + ' Blog drafts not found.' });
            }
        });
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
            var errorText = '';

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
                    // create the blog
                    var savedBlog = {
                        'customShort': postId,
                        'title': req.body.title,
                        'image': req.body.image,
                        'shortDescription': req.body.shortDescription,
                        'body': req.body.body
                    };

                    // save the blog
                    SavedBlogPost.save(savedBlog, function(err, newSavedBlog) {
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
                            newSavedBlog = SavedBlogPost.toObject(newSavedBlog, { 'hide': 'customShort' });
                            newSavedBlog.url = url;

                            // send success with blog data
                            res.json({ 'd': newSavedBlog });
                        }
                    });
                }
                else {
                    // send bad request
                    res.status(400).send({ title: errorHandler.getErrorTitle({ code: 400 }), message: errorHandler.getGenericErrorMessage({ code: 400 }) + ' Invalid Blog Post Id.' });
                }
            }
            else {
                // create the blog
                var savedBlog = {
                    'new': true,
                    'title': req.body.title,
                    'image': req.body.image,
                    'shortDescription': req.body.shortDescription,
                    'body': req.body.body
                };

                // save the blog
                SavedBlogPost.save(savedBlog, function(err, newSavedBlog) {
                    // if error occurred
                    if (err) {
                        // send internal error
                        res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err) });
                        console.log(clc.error(errorHandler.getDetailedErrorMessage(err)));
                    }
                    else if(newSavedBlog) {
                        // set url
                        var url = newSavedBlog.customShort;

                        // make an object
                        newSavedBlog = SavedBlogPost.toObject(newSavedBlog, { 'hide': 'customShort' });
                        newSavedBlog.url = url;

                        // send success with blog data
                        res.json({ 'd': newSavedBlog });
                    }
                    else {
                        // send bad request
                        res.status(400).send({ title: errorHandler.getErrorTitle({ code: 400 }), message: errorHandler.getGenericErrorMessage({ code: 400 }) });
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

    // make an object
    blogDraft = SavedBlogPost.toObject(blogDraft, { 'hide': 'customShort' });
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
            var errorText = '';

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
                'title': req.body.title,
                'image': req.body.image,
                'shortDescription': req.body.shortDescription,
                'body': req.body.body,
                'dateSaved': new Date()
            };

            // update blog draft
            SavedBlogPost.update({ '_id' : blogDraft._id }, updatedValues, function(err, updatedDraft) {
                // if error occurred
                if (err) {
                    // send internal error
                    res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err) });
                    console.log(clc.error(errorHandler.getDetailedErrorMessage(err)));
                }
                else {
                    // set url
                    var url = updatedDraft.customShort;

                    // make an object
                    updatedDraft = SavedBlogPost.toObject(updatedDraft, { 'hide': 'customShort' });
                    updatedDraft.url = url;

                    // send success with blog data
                    res.json({ 'd': updatedDraft });
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

    // remove draft
    SavedBlogPost.remove(blogDraft, function(err) {
        // if an error occurred
        if (err) {
            // send internal error
            res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err) });
            console.log(clc.error(errorHandler.getDetailedErrorMessage(err)));
        }
        else {
            // return success
            res.status(200).send({ 'd': { title: errorHandler.getErrorTitle({ code: 200 }), message: errorHandler.getGenericErrorMessage({ code: 200 }) + ' You have discarded the saved post successfully!' } });
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
            var errorText = '';

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

            // create the blog
            var blogPost = {
                'customShort': blogDraft.customShort,
                'title': req.body.title,
                'image': req.body.image,
                'shortDescription': req.body.shortDescription,
                'body': req.body.body
            };

            // save the blog
            BlogPost.save(blogPost, function(err, newPostedBlog) {
                // if error occurred
                if (err) {
                    // send internal error
                    res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err) });
                    console.log(clc.error(errorHandler.getDetailedErrorMessage(err)));
                }
                else {
                    // remove draft
                    SavedBlogPost.remove(blogDraft, function(err) {
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
                            newPostedBlog = BlogPost.toObject(newPostedBlog, { 'hide': 'customShort' });
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
 * Blog Draft middleware
 */
exports.draftBlogByID = function (req, res, next, id) {
    // find saved blog post based on id
    SavedBlogPost.findOne({ 'customShort': id }, function(err, foundDraft) {
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
                res.status(200).send({ 'd': { error: true, title: errorHandler.getErrorTitle({ code: 404 }), message: errorHandler.getGenericErrorMessage({ code: 404 }) + ' Blog draft not found.' } });
            }
            else {
                // send not found
                res.status(404).send({ title: errorHandler.getErrorTitle({ code: 404 }), message: errorHandler.getGenericErrorMessage({ code: 404 }) + ' Blog draft not found.' });
            }
        }
    });
};