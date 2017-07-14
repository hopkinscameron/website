'use strict';
/**
 *  Name: The Analytics Page Schema
    Description: Determines how a page's analytics is defined
 */

/**
 * Module dependencies
 */
var // the communication to mongo database
    mongoose = require('mongoose'),
    // the scheme for mongoose/mongodb
    Schema = mongoose.Schema

/**
 * Analytics Page Schema
 */ 
var AnalyticsPageSchema = new Schema({
    url: {
        type: String,
        required: true,
        unique: true
    },
    accessedBy: [
        {
            userPublicIP: {
                type: String,
                required: true
            },
            localIP: {
                type: String,
                required: true
            },
            accessedTime: {
                type: Date,
                required: true
            },
            requestType: {
                type: String,
                required: true
            },
            country: {
                type: String,
                required: true
            },
            region: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            ll: {
                type: String,
                required: true
            },
            zip: {
                type: String,
                required: true
            }
        }
    ]
});

// function that is called before updating to database
AnalyticsPageSchema.pre('save', function(next) {
    // update the count
    this.count++;
    return next();
});

// function that is called before updating to database
AnalyticsPageSchema.pre('findOneAndUpdate', function(next) {
    // update the count
    this.update({},{ $inc: { count: 1 } }).exec(function(err, savedBlog) {
        return next();
    });
});

// specify the transform schema option
if (!AnalyticsPageSchema.options.toObject) {
    AnalyticsPageSchema.options.toObject = {};
}

// set options for returning an object
AnalyticsPageSchema.options.toObject.transform = function (doc, ret, options) {
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
module.exports = mongoose.model("AnalyticsPage", AnalyticsPageSchema);