'use strict';

/**
 * Module dependencies.
 */
var app = require('./config/lib/app');

try {
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