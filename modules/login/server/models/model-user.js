'use strict';

/**
 *  Name: The User Schema
    Description: Determines how a user is defined
 */

/**
 * Module dependencies
 */
var // generate UUID's
    uuidv1 = require('uuid/v1'),
    // lodash
    _ = require('lodash'),
    // the file system to read/write from/to files locally
    fs = require('fs'),
    // the path
    path = require('path'),
    // the helper functions
    helpers = require(path.resolve('./config/lib/global-model-helpers')),
    // the Analytics db
    db = require('./db/users'),
    // the db full path
    dbPath = 'modules/login/server/models/db/users.json',
    // get the default config
	defaultConfig = require(path.resolve('./config/env/default')),
    // bcrypt for cryptography
    bcrypt = require('bcryptjs');

/**
 * User Schema
 */ 
var UserSchema = {
    _id: {
        type: String
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    passwordUpdatedLast: {
        type: Date
    },
    lastLogin: {
        type: Date
    }
};

// the required properties
var requiredSchemaProperties = helpers.getRequiredProperties(UserSchema);

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
    var firstProp = null;

    // find the first property that doesn't exists
    _.forEach(requiredSchemaProperties, function(value) {
        if(!_.has(objToSave, value)) {
            firstProp = value;
            return false;
        }
    });

    // if there is a property that doesn't exist
    if(firstProp) {
        // create new error
        err = new Error(`All required properties are not present on object. The property \'${firstProp}\' was not in the object.`);
    }
    else {
        // find the object matching the object
        obj = _.find(db, objToSave) || null;

        // if object was found
        if(obj) {
            // get index of object
            var index = _.findIndex(db, obj);

            // merge old data with new data
            _.merge(obj, objToSave);

            // encrypt password
            encryptPasswordSync(objToSave);

            // replace item at index using native splice
            db.splice(index, 1, obj);
        }
        else {
            // generate UUID
            objToSave._id = uuidv1();

            // encrypt password
            encryptPasswordSync(objToSave);

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

/**
 * Compares password
 */
exports.comparePassword = function(user, plainTextPassword, callback) {
    // compare the passwords
    bcrypt.compare(plainTextPassword, user.password, function(err, isMatch) {
        // if error occurred
        if (err) {
            return callback(err);
        } 

        callback(null, isMatch);
    });
};

/**
 * Converts to object
 */
exports.toObject = function(obj, options) {
    // clone object
    var clonedObj = _.cloneDeep(obj);

    // if object
    if(clonedObj) {
        // if hide options
        if (options.hide) {
            // go through each option and remove
            _.forEach(options.hide.split(' '), function (value) {
                delete clonedObj[value];
            });
        }

        // always hide the id and version
        delete clonedObj['_id'];
        delete clonedObj['__v'];
    }

    return clonedObj;
};

// encrypt password
function encryptPasswordSync(user) {
    try {
        // get the salt and hash
        var salt = bcrypt.genSaltSync(defaultConfig.saltRounds);
        var hash = bcrypt.hashSync(user.password, salt);

        // override the cleartext password with the hashed one
        user.password = hash;
    }
    catch (err) {
        throw err;
    }
};

// encrypt password
function encryptPassword(user, callback) {
    // generate a salt
    bcrypt.genSalt(defaultConfig.saltRounds, function(err, salt) {
        // if error occurred
        if (err) {
            return callback(err);
        }

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            // if error occurred
            if (err) {
                return callback(err);
            } 

            // override the cleartext password with the hashed one
            user.password = hash;
            callback();
        });
    });
};