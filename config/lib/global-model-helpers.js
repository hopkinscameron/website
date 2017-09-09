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

    // return the properties
    return prop;
};

/**
 * Get first property that is required but doesn't exist
 */
exports.checkRequiredProperties = function (properties, obj) {
    // the first property value that isn't present
    var firstProp = null;

    // find the first property that doesn't exists
    _.forEach(properties, function(value) {
        if(!_.has(obj, value)) {
            firstProp = value;
            return false;
        }
    });

    // return the first property
    return firstProp;
};

/**
 * Get non overwritable properties of model
 */
exports.getNonOverwritableProperties = function (model) {
    // the properties that aren't overwritable by user
    var prop = [];

    // get the keys
    var keys = Object.keys(model);

    // loop over all keys
    _.forEach(keys, function(value) {
        if(model[value].overwriteable == false) {
            prop.push(value);
        }
    });

    // return the properties
    return prop;
};

/**
 * Set defaults to non overwritable properties of model
 */
exports.setNonOverwritablePropertyDefaults = function (properties, model, obj) {
    // loop over all keys
    _.forEach(properties, function(value) {
        if(model[value].default) {
            obj[value] = model[value].default;
        }
    });
};

/**
 * Remove any attempted overwritables
 */
exports.removeAttemptedNonOverwritableProperties = function (properties, obj) {
    // go through each option and remove the attempted overwritables
    _.forEach(Object.keys(obj), function (value) {
        if(properties.includes(value)) {
            delete obj[value];
        }
    });
};

/**
 * Get existing keys of model
 */
exports.getAllExistingKeysFromModel = function (model) {
    // return the keys
    return Object.keys(model);
};

/**
 * Converts To Object
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

/**
 * Find
 */
exports.find = function (db, query, callback) {
    // the array of objects to return
    var objs = null;
    
    // the error to return
    var err = null;

    // find the object matching the query
    objs = _.filter(db, query) || null;

    // if a callback
    if(callback) {
        // hit the callback
        callback(err, objs);
    }
};

/**
 * Find By Id
 */
exports.findById = function (db, id, callback) {
    // the object to return
    var obj = null;
    
    // the error to return
    var err = null;

    // find the object matching the query
    obj = _.find(db, { '_id': id }) || null;

    // if a callback
    if(callback) {
        // hit the callback
        callback(err, obj);
    }
};

/**
 * Find One
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
 * Remove
 */
exports.remove = function(db, objToRemove, callback) {
    // the error to return
    var err = null;

    // get index of object
    var index = _.findIndex(db, objToRemove);
    
    // if object was found
    if(index != -1) {
        // remove item at index using native splice
        db.splice(index, 1);
    }

    // if a callback
    if(callback) {
        // hit the callback
        callback(err);
    }
};

/**
 * Sort
 */
exports.sort = function(arr, query, callback) {
    // the array of objects to return
    var objs = null;
    
    // the error to return
    var err = null;

    // find the object matching the query
    objs = _.orderBy(arr, Object.keys(query), Object.values(query)) || null;

    // if a callback
    if(callback) {
        // hit the callback
        callback(err, objs);
    }
};

/**
 * Read Database
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
 * Updates Database
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