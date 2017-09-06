'use strict';

/**
 *  Name: The Blog Post Schema
    Description: Determines how a blog post is defined
 */

/**
 * Module dependencies
 */
var // lodash
    _ = require('lodash'),
    // the file system to read/write from/to files locally
	fs = require('fs'),
    // the Analytics db
    db = require('./db/blog-posts');

/**
 * Blog Post Schema
 */ 
var BlogPostSchema = new {
    customShort: "",
    title: "",
    image: "",
    shortDescription: "",
    body: "",
    author: "Cameron Hopkins",
    datePublished: new Date(),
    dateUpdated: new Date(),
    views: 0
};