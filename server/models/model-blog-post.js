'use strict';
/**
 *  Name: The Blog Post Schema
    Description: Determines how a blog post is defined
 */

/**
 * Module dependencies
 */
var // the communication to mongo database
    mongoose = require('mongoose'),
    // the scheme for mongoose/mongodb
    Schema = mongoose.Schema

/**
 * Blog Post Schema
 */ 
var BlogPostSchema = new Schema({
    customShort: {
        type: String,
        required: true,
        unique: true
    },
    title: { 
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
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
    author: {
        type: String,
        required: true,
        trim: true,
        default: "Cameron Hopkins"
    },
    datePublished: {
        type: Date,
        required: true,
        default: new Date()
    },
    dateUpdated: {
        type: Date
    },
    views: {
        type: Number,
        required: true,
        default: 0
    }
});

// add an index for searching text
BlogPostSchema.index({ title: 'text', shortDescription: 'text', body: 'text', author: 'text' });

// function that is called before updating to database
BlogPostSchema.pre('save', function(next) {
    // update the date published
    this.datePublished = new Date();
    return next();
});

// function that is called before updating to database
BlogPostSchema.pre('findOneAndUpdate', function(next) {
    // update the date updated
    this.update({},{ $set: { dateUpdated: new Date() } }).exec(function(err, updatedBlog) {
        return next();
    });
});

// specify the transform schema option
if (!BlogPostSchema.options.toObject) {
    BlogPostSchema.options.toObject = {};
}

// set options for returning an object
BlogPostSchema.options.toObject.transform = function (doc, ret, options) {
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
};

// export for other uses
module.exports = mongoose.model("BlogPost", BlogPostSchema);