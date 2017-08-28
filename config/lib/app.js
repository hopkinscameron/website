'use strict';

/**
 * Module dependencies.
 */
var // the application configuration
    config = require('../config'),
    // mongoose configuration
    mongoose = require('./mongoose'),
    // express configuration
    express = require('./express'),
    // lodash
    _ = require('lodash'),
    // clc colors for console logging
    clc = require('./clc');
    
// initialize models
mongoose.loadModels();

// on initialize mongoose
module.exports.init = function init(callback) {
    // connect to mongodb
    mongoose.connect(function (db) {
        // initialize express
        var app = express.init(db);

        // if there is a callback
        if (callback) {
            callback(app, db, config);
        } 
    });
};

// on start
module.exports.start = function start(callback) {
    var _this = this;

    // initialize
    _this.init(function (app, db, config) {

        // start the app by listening on <port> at <host>
        app.listen(config.port, config.host, function () {
            // create server URL
            var server = (process.env.NODE_ENV === 'production' && config.secure.ssl ? 'https://' : 'http://') + config.host + ':' + config.port;

            // environment
            var env = process.env.NODE_ENV.charAt(0).toUpperCase() + process.env.NODE_ENV.slice(1);

            // logging initialization
            console.log('--');
            console.log(clc.success(config.app.title  + ' - ' + env + ' Enviornment'));
            console.log();
            console.log(clc.success('Environment:     ' + env));
            console.log(clc.success('Server:          ' + server));
            console.log(clc.success('Database:        ' + config.db.uri));
            console.log(clc.success('App version:     ' + config.personalWebsite.version));            
            console.log('--');

            // if there is a callback
            if (callback) {
                callback(app, db, config);
            }
        });
    });
};