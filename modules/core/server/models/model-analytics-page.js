'use strict';

/**
 *  Name: The Analytics Schema Definition
    Description: Determines how a page's analytics is defined
 */

/**
 * Module dependencies
 */
var // generate UUID's
    uuidv1 = require('uuid/v1'),
    // lodash
    _ = require('lodash'),
    // the path
    path = require('path'),
    // the helper functions
    helpers = require(path.resolve('./config/lib/global-model-helpers')),
    // the database
    db = require('./db/analytics'),
    // the db full path
    dbPath = 'modules/core/server/models/db/analytics.json';

/**
 * Analytics Schema
 */ 
var AnalyticsSchema = {
    _id: {
        type: String,
        overwriteable: false
    },
    created: {
        type: Date,
        overwriteable: false
    },
    request: {
        type: String,
        required: true
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
        overwriteable: false,
        default: 1
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
                    type: String,
                },
                username: {
                    type: String,
                    lowercase: true,
                    trim: true
                }
            }
        }
    ]
};

// the required properties
var requiredSchemaProperties = helpers.getRequiredProperties(AnalyticsSchema);

// the non overwritable properties the user cannot self change
var nonOverwritableSchemaProperties = helpers.getNonOverwritableProperties(AnalyticsSchema);

/**
 * Find One
 */
exports.findOne = function(query, callback) {
    // find one
    helpers.findOne(db, query, function(err, obj) {
        // if a callback
        if(callback) {
            // hit the callback
            callback(err, _.cloneDeep(obj));
        }
    });
};

/**
 * Save
 */
exports.save = function(objToSave, callback) {
    // the object to return
    var obj = null;
    
    // the error to return
    var err = null;

    // the first property value that isn't present
    var firstProp = helpers.checkRequiredProperties(requiredSchemaProperties, objToSave);

    // if there is a property that doesn't exist
    if(firstProp) {
        // create new error
        err = new Error(`All required properties are not present on object. The property \'${firstProp}\' was not in the object.`);
    }
    else {
        // remove any keys that may have tried to been overwritten
        helpers.removeAttemptedNonOverwritableProperties(nonOverwritableSchemaProperties, objToSave);

        // find the object matching the object
        obj = _.find(db, objToSave) || null;

        // if object was found
        if(obj) {
            // get index of object
            var index = _.findIndex(db, obj);

            // merge old data with new data
            _.merge(obj, objToSave);

            // set the count
            obj.count = obj.accessedBy.length;

            // replace item at index using native splice
            db.splice(index, 1, obj);
        }
        else {
            // set all defaults
            helpers.setNonOverwritablePropertyDefaults(nonOverwritableSchemaProperties, AnalyticsSchema, objToSave);

            // generate UUID
            objToSave._id = uuidv1();

            // set created date
            objToSave.created = new Date();

            // push the new object
            db.push(objToSave);
        }

        // update the db
        helpers.updateDB(dbPath, db, function(e) {
            // set error
            err = e;

            // if error, reset object
            obj = err ? null : obj;
        });
    }

    // if a callback
    if(callback) {
        // hit the callback
        callback(err, _.cloneDeep(obj));
    }
};

/**
 * Update
 */
exports.update = function(query, updatedObj, callback) {
    // the object to return
    var obj = null;
    
    // the error to return
    var err = null;

    // find the object matching the object
    obj = _.find(db, query) || null;

    // if object was found
    if(obj) {
        // remove any keys that may have tried to been overwritten
        helpers.removeAttemptedNonOverwritableProperties(nonOverwritableSchemaProperties, updatedObj);

        // get index of object
        var index = _.findIndex(db, obj);

        // merge old data with new data
        _.merge(obj, updatedObj);

        // set the count
        obj.count = obj.accessedBy.length;

        // replace item at index using native splice
        db.splice(index, 1, obj);

        // update the db
        helpers.updateDB(dbPath, db, function(e) {
            // set error
            err = e;

            // if error, reset object
            obj = err ? null : obj;
        });
    }

    // if a callback
    if(callback) {
        // hit the callback
        callback(err, _.cloneDeep(obj));
    }
};