'use strict';
/**
 *  Name: The Blog Search Schema
    Description: Determines how a blog search is defined
 */

/**
 * Module dependencies
 */
var // the communication to mongo database
    mongoose = require('mongoose'),
    // the scheme for mongoose/mongodb
    Schema = mongoose.Schema

/**
 * Blog Search Schema
 */ 
var BlogSearchSchema = new Schema({
    keyword: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: true
    },
    hits: {
        type: Number,
        default: 0,
        required: true
    }
});

// specify the transform schema option
if (!BlogSearchSchema.options.toObject) {
    BlogSearchSchema.options.toObject = {};
}

// set options for returning an object
BlogSearchSchema.options.toObject.transform = function (doc, ret, options) {
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
module.exports = mongoose.model("BlogSearch", BlogSearchSchema);