'use strict';

/**
 * Module dependencies.
 */
// initialize enviornment variables
require('dotenv').config()

var // configure the app
    app = require('./config/lib/app'),
    // start server
    server = app.start();