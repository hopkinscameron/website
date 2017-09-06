'use strict';

/**
 *  Name: The Saved Blog Post Schema
    Description: Determines how a saved blog post is defined
 */

/**
 * Module dependencies
 */
var // lodash
    _ = require('lodash'),
    // the file system to read/write from/to files locally
	fs = require('fs'),
    // the Analytics db
    db = require('./db/blog-saved-posts');

/**
 * Saved Blog Post Schema
 */ 
var SavedBlogPostSchema = new {
    customShort: "",
    title: "",
    image: "",
    shortDescription: "",
    body: "",
    dateSaved: new Date()
};