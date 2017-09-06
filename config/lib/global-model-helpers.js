/**
 * Module dependencies
 */
var // lodash
    _ = require('lodash'),
    // the file system to read/write from/to files locally
    fs = require('fs');

/**
 * Get required properties of model
 */
exports.getRequiredProperties = function (model) {
    // the properties that aren't present
    var prop = [];

    // get the keys
    var keys = Object.keys(model);

    // loop over all keys
    _.forEach(keys, function(value) {
        if(model[value].required) {
            prop.push(value);
        }
    });

    return prop;
};

/**
 * Find one object
 */
exports.findOne = function (db, query, callback) {
    // the object to return
    var obj = null;
    
    // the error to return
    var err = null;

    // find the object matching the query
    obj = _.find(db, query) || null;

    // if a callback
    if(callback) {
        // hit the callback
        callback(err, obj);
    }
};

/**
 * Save
 */
exports.save = function(dbPath, db, objToSave, callback) {
    
};

/**
 * Read database
 */
exports.readDB = function (dbPath, callback) {
    // the database to return
    var db = null;

    // the error to return
    var err = null;

    try {
        // read the db
        db = require(dbPath);
    }
    catch (e) {
        err = e;
    }

    // if callback
    if(callback) {
        callback(err, db);
    }
};

/**
 * Updates database
 */
exports.updateDB = function(dbPath, dbData, callback) {
    // the error to return
    var err = null;

    try {
        fs.writeFileSync(dbPath, JSON.stringify(dbData), 'utf8');
    }
    catch (e) {
        err = e;
    }

    // if callback
    if(callback) {
        callback(err);
    }
};

/*
module.exports = {
    getRequiredProperties: getRequiredProperties,
    findOne: findOne,
    readDB: readDB,
    updateDB: updateDB
};
*/