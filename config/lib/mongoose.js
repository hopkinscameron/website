'use strict';

/**
 * Module dependencies.
 */
var // the application configuration
    config = require('../config'),
    // clc colors for console logging
    clc = require('./clc'),
    // path
    path = require('path'),
    // mongoose for mongodb
    mongoose = require('mongoose');

/**
 * Load the mongoose models
 */
module.exports.loadModels = function (callback) {
    // globbing model files
    config.files.server.models.forEach(function (modelPath) {
        require(path.resolve(modelPath));
    });

    // if a callback
    if (callback) {
        callback();
    } 
};

/**
 * Initialize Mongoose
 */
module.exports.connect = function (cb) {
    var _this = this;

    // setup the mongoose promise
    mongoose.Promise = config.db.promise;

    // connect to mongodb
    var db = mongoose.connect(config.db.uri, config.db.options, function (err) {
        // log error
        if (err) {
            console.error(clc.error('Could not connect to MongoDB!'));
            console.log(clc.error(err));

            // exit from the application
            process.exit();
        } 
        else {
            // Enabling mongoose debug mode if required
            mongoose.set('debug', config.db.debug);

            // if a callbackN
            if (cb) {
                cb(db);
            }
        }
    });
};

/**
 * Disconnect from Mongoose
 */
module.exports.disconnect = function (cb) {
    // disconeect from mongo
    mongoose.disconnect(function (err) {
        console.info(clc.warn('Disconnected from MongoDB.'));
        cb(err);
    });
};