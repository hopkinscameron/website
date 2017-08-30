'use strict';

/**
 * Module dependencies.
 */
// initialize enviornment variables
require('dotenv').config()

try {
    // configure the app
    var app = require('./config/lib/app');
    // start server
    var server = app.start();
}
catch (e) {
    console.error(e);
}

process.on('uncaughtException', (err) => {
    console.error(err);
});

process.on('exit', (code) => {
    console.error(`About to exit with code: ${code}`);
});