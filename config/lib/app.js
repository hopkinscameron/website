'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
    mongoose = require('./mongoose'),
    express = require('./express'),
    clc = require('./clc'),
    seed = require('./seed');

function seedDB() {
    if (config.seedDB && config.seedDB.seed) {
        console.log(chalk.bold.red('Warning:  Database seeding is turned on'));
        seed.start();
    }
};

// Initialize Models
mongoose.loadModels(seedDB);

module.exports.init = function init(callback) {
    mongoose.connect(function (db) {
        // Initialize express
        var app = express.init(db);
        if (callback) {
            callback(app, db, config);
        }
    });
};

module.exports.start = function start(callback) {
    var _this = this;

    _this.init(function (app, db, config) {
        // Start the app by listening on <port> at <host>
        app.listen(config.port, config.host, function () {
          // Create server URL
          var server = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.host + ':' + config.port;
          // Logging initialization
          console.log('--');
          console.log(clcConfig.success(config.app.title));
          console.log();
          console.log(clcConfig.success('Environment:     ' + process.env.NODE_ENV));
          console.log(clcConfig.success('Server:          ' + server));
          console.log(clcConfig.success('Database:        ' + config.db.uri));
          console.log(clcConfig.success('App version:     ' + config.personalWebsite.version));
          console.log('--');

          if (callback) callback(app, db, config);
        });
    });
};