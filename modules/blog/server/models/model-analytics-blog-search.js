'use strict';

/**
 *  Name: The Analytics Blog Search Schema
    Description: Determines how a blog search is defined
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
    db = require('./db/blog-search-analytics'),
    // the db full path
    dbPath = 'modules/blog/server/models/db/blog-search-analytics.json';

/**
 * Analytics Blog Search Schema
 */ 
var AnalyticsBlogSearchSchema = {
    _id: {
        type: String,
        overwriteable: false
    },
    created: {
        type: Date,
        overwriteable: false
    },
    keyword: {
        type: String,
        required: true
    },
    hits: {
        type: Number,
        overwriteable: false,
        default: 1
    }
};

// the required properties
var requiredSchemaProperties = helpers.getRequiredProperties(AnalyticsBlogSearchSchema);

// the non overwritable properties the user cannot self change
var nonOverwritableSchemaProperties = helpers.getNonOverwritableProperties(AnalyticsBlogSearchSchema);

// the non default properties
var defaultSchemaProperties = helpers.getDefaultProperties(AnalyticsBlogSearchSchema);

// the searchable properties
var searchableSchemaProperties = helpers.getSearchableProperties(AnalyticsBlogSearchSchema);

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
        obj = _.find(db, { 'keyword': objToSave.keyword }) || null;

        // if object was found
        if(obj) {
            // get index of object
            var index = _.findIndex(db, obj);

            // merge old data with new data
            _.merge(obj, objToSave);

            // increase the hits
            obj.hits++;

            // replace item at index using native splice
            db.splice(index, 1, obj);
        }
        else {
            // set all defaults
            helpers.setNonOverwritablePropertyDefaults(defaultSchemaProperties, AnalyticsBlogSearchSchema, objToSave);

            // generate UUID
            objToSave._id = uuidv1();

            // set created date
            objToSave.created = new Date();

            // push the new object
            db.push(objToSave);

            // set object to new saved object
            obj = objToSave;
        }

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
};

/**
 * Update
 */
exports.update = function(query, updatedObj, callback) {
    // the object to return
    var obj = null;
    
    // the error to return
    var err = null;

    // find the object matching the object index
    var index = _.findIndex(db, query);
    obj = index != -1 ? db[index] : null;

    // if object was found
    if(obj) {
        // remove any keys that may have tried to been overwritten
        helpers.removeAttemptedNonOverwritableProperties(nonOverwritableSchemaProperties, updatedObj);

        // merge old data with new data
        _.merge(obj, updatedObj);

        // increase the hits
        obj.hits++;

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
        // if a callback
        if(callback) {
            // hit the callback
            callback(err, _.cloneDeep(obj));
        }
    }
};