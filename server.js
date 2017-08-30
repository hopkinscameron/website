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