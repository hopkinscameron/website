'use strict';
/**
 *  Name: The Saved Blog Post Schema
    Description: Determines how a saved blog post is defined
 */

/**
 * Module dependencies
 */
var // the communication to mongo database
    mongoose = require('mongoose'),
    // the scheme for mongoose/mongodb
    Schema = mongoose.Schema

/**
 * Saved Blog Post Schema
 */ 
var SavedBlogPostSchema = new Schema({
    title: { 
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    shortDescription: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true,
        trim: true
    },
    dateSaved: {
        type: Date,
        required: true
    }
});

// specify the transform schema option
if (!SavedBlogPostSchema.options.toObject) {
    SavedBlogPostSchema.options.toObject = {};
}

// set options for returning an object
SavedBlogPostSchema.options.toObject.transform = function (doc, ret, options) {
    // if hide options
    if (options.hide) {
        // go through each option and remove
        options.hide.split(' ').forEach(function (prop) {
            delete ret[prop];
        });
    }

    // always hide the id and version
    delete ret['_id'];
    delete ret['__v'];

    // return object
    return ret;
}

// export for other uses
module.exports = mongoose.model("SavedBlogPost", SavedBlogPostSchema);