'use strict';

/**
 *  Name: The Analytics Blog Search Schema
    Description: Determines how a blog search is defined
 */

/**
 * Module dependencies
 */
var // lodash
    _ = require('lodash'),
    // the file system to read/write from/to files locally
	fs = require('fs'),
    // the Analytics db
    db = require('./db/blog-search-analytics');

/**
 * Analytics Blog Search Schema
 */ 
var AnalyticsBlogSearchSchema = new {
    keyword: "",
    hits: 0
};