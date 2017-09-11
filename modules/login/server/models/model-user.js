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
        type: String,
        overwriteable: false
    },
    created: {
        type: Date,
        overwriteable: false
    },
    internalName: {
        type: String,
        overwriteable: false
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
        type: Date,
        overwriteable: false
    },
    lastLogin: {
        type: Date
    }
};

// the required properties
var requiredSchemaProperties = helpers.getRequiredProperties(UserSchema);

// the non overwritable properties the user cannot self change
var nonOverwritableSchemaProperties = helpers.getNonOverwritableProperties(UserSchema);

/**
 * Converts to object
 */
exports.toObject = function(obj, options) {
    // return the obj
    return _.cloneDeep(helpers.toObject(obj, options));
};

/**
 * Find By Id
 */
exports.findById = function(id, callback) {
    // find one
    helpers.findById(db, id, function(err, obj) {
        // if a callback
        if(callback) {
            // hit the callback
            callback(err, _.cloneDeep(obj));
        }
    });
};

/**
 * Find One
 */
exports.findOne = function(query, callback) {
    // if querying on username, change to lowercase and delete username query
    query.internalName = query.username ? query.username.toLowerCase() : null;
    delete query['username'];

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

        // find the object matching the object index
        var index = _.findIndex(db, objToSave);
        obj = index != -1 ? db[index] : null;

        // if object was found
        if(obj) {
            // if username was changed
            if(objToSave.username) {
                // update the internal name
                objToSave.internalName = objToSave.username.toLowerCase();
            }

            // merge old data with new data
            _.merge(obj, objToSave);
            
            // encrypt password
            encryptPassword(objToSave, function(err) {
                // if error occurred
                if(err) {
                    return callback(err);
                }
                else {
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
            });
        }
        else {
            // set all defaults
            helpers.setNonOverwritablePropertyDefaults(nonOverwritableSchemaProperties, UserSchema, objToSave);

            // encrypt password
            encryptPassword(objToSave, function(err) {
                // if error occurred
                if(err) {
                    return callback(err);
                }
                else {
                    // generate UUID
                    objToSave._id = uuidv1();

                    // set created date
                    objToSave.created = new Date();

                    // set the internal name
                    objToSave.internalName = objToSave.username.toLowerCase();

                    // push the new object
                    db.push(objToSave);

                    // update the db
                    helpers.updateDB(dbPath, db, function(e) {
                        // set error
                        err = e;

                        // if error, reset object
                        objToSave = err ? null : objToSave;

                        // if a callback
                        if(callback) {
                            // hit the callback
                            callback(err, _.cloneDeep(objToSave));
                        }
                    });
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

    // find the object matching the object index
    var index = _.findIndex(db, query);
    obj = index != -1 ? db[index] : null;

    // if object was found
    if(obj) {
        // remove any keys that may have tried to been overwritten
        helpers.removeAttemptedNonOverwritableProperties(nonOverwritableSchemaProperties, updatedObj);

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

// encrypt password
function encryptPasswordSync(user) {
    // if password exists
    if(user.password) {
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
    }
};

// encrypt password
function encryptPassword(user, callback) {
    // if password exists
    if(user.password) {
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

                // set password updated last
                user.passwordUpdatedLast = new Date();

                callback();
            });
        });
    }
};