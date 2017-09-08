'use strict';

/**
 *  Name: The Blog Post Schema
    Description: Determines how a blog post is defined
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
    db = require('./db/blog-posts'),
    // the db full path
    dbPath = 'modules/blog/server/models/db/blog-posts.json';

/**
 * Blog Post Schema
 */ 
var BlogPostSchema = {
    _id: {
        type: String,
        overwriteable: false
    },
    created: {
        type: Date,
        overwriteable: false
    },
    customShort: {
        type: String
    },
    title: {
        type: String
    },
    image: {
        type: String
    },
    shortDescription: {
        type: String
    },
    body: {
        type: String
    },
    author: {
        type: String,
        overwriteable: false,
        default: "Cameron Hopkins"
    },
    datePublished: {
        type: Date,
        overwriteable: false
    },
    dateUpdated: {
        type: Date,
        overwriteable: false
    },
    views: {
        type: Number,
        default: 0
    }
};

// the required properties
var requiredSchemaProperties = helpers.getRequiredProperties(BlogPostSchema);

// the non overwritable properties the user cannot self change
var nonOverwritableSchemaProperties = helpers.getNonOverwritableProperties(BlogPostSchema);

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
        helpers.setNonOverwritablePropertyDefaults(nonOverwritableSchemaProperties, objToSave);

        // find the object matching the object
        obj = _.find(db, objToSave) || null;

        // if object was found
        if(obj) {
            // set date updated
            objToSave.dateUpdated = new Date();

            // get index of object
            var index = _.findIndex(db, obj);

            // merge old data with new data
            _.merge(obj, objToSave);
            
            // replace item at index using native splice
            db.splice(index, 1, obj);

            // update the db
            helpers.updateDB(dbPath, db, function(e) {
                // set error
                err = e;

                // if error, reset object
                obj = err ? null : obj;

                // if a callback
                if(callback) {
                    // hit the callback
                    callback(err, _.cloneDeep(obj));
                }
            });
        }
        else {
            // set all defaults
            helpers.setNonOverwritablePropertyDefaults(nonOverwritableSchemaProperties, BlogPostSchema, objToSave);

            // generate UUID
            objToSave._id = uuidv1();

            // set created date
            objToSave.created = new Date();

            // set date published
            objToSave.datePublished = new Date();

            // push the new object
            db.push(objToSave);

            // update the db
            helpers.updateDB(dbPath, db, function(e) {
                // set error
                err = e;

                // if error, reset object
                obj = err ? null : obj;

                // if a callback
                if(callback) {
                    // hit the callback
                    callback(err, _.cloneDeep(obj));
                }
            });
        }
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