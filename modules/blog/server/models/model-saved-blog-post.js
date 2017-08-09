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
        trim: true
    },
    body: {
        type: String,
        trim: true
    },
    dateSaved: {
        type: Date,
        required: true,
        default: new Date()
    }
});

// function that is called before updating to database
SavedBlogPostSchema.pre('save', function(next) {
    // update the date saved
    this.dateSaved = new Date();
    return next();
});

// function that is called before updating to database
SavedBlogPostSchema.pre('findOneAndUpdate', function(next) {
    // update the date saved
    this.update({},{ $set: { dateSaved: new Date() } }).exec(function(err, updatedSavedBlog) {
        return next();
    });
});

// specify the transform schema option
if (!SavedBlogPostSchema.options.toObject) {
    SavedBlogPostSchema.options.toObject = {};
}

// set options for returning an object
SavedBlogPostSchema.options.toObject.transform = function (doc, ret, options) {
    // get the short id
    var shortId = ret.customShort;

    // if hide options
    if (options.hide) {
        // go through each option and remove
        options.hide.split(' ').forEach(function (prop) {
            delete ret[prop];
        });
    }
    
    // replace short id with url
    ret.url = shortId;

    // always hide the id and version
    delete ret['_id'];
    delete ret['__v'];

    // return object
    return ret;
};

// export for other uses
module.exports = mongoose.model('SavedBlogPost', SavedBlogPostSchema);