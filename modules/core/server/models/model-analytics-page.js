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
    request: {
        type: String,
        required: true,
        unique: true
    },
    url: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        default: 0,
        required: true
    },
    accessedBy: [
        {
            userPublicIP: {
                type: String,
                required: true
            },
            userLocalIP: {
                type: String,
                required: true
            },
            accessedTime: {
                type: Date,
                required: true
            },
            location: {
                city: {
                    type: String
                },
                country: {
                    type: String
                },
                ll: {
                    latitude: {
                        type: Number
                    },
                    longitude: {
                        type: Number
                    }
                },
                metro: {
                    type: Number
                },
                range: {
                    lowBoundIPBlock: {
                        type: Number
                    },
                    highBoundIPBlock: {
                        type: Number
                    }
                },
                region: {
                    type: String
                },
                zip: {
                    type: Number
                }
            },
            user: {
                _id: {
                    type: Schema.Types.ObjectId
                },
                username: {
                    type: String,
                    lowercase: true,
                    trim: true
                }
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
};

// export for other uses
module.exports = mongoose.model('AnalyticsPage', AnalyticsPageSchema);