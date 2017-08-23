'use strict';

/**
 * Module dependencies.
 */
var // the default environment configuration
    defaultEnvConfig = require('./default'),
    // the file system to read/write from/to files locally
    fs = require('fs');

module.exports = {
    db: {
        uri: process.env.MONGODB || 'mongodb://localhost:27017/personal_website',
        options: {
            db: { 
                native_parser: true 
            },
            server: { 
                poolSize: 5 
            },
            user: process.env.DB_USER,
            pass: process.env.DB_PASS
        },
        // Enable mongoose debug mode
        debug: process.env.MONGODB_DEBUG || false
    },
    port: process.env.PORT_UNSECURE || 80,
    // Binding to 127.0.0.1 is safer in production.
    host: process.env.HOST || '0.0.0.0',
    log: {
        // logging with Morgan - https://github.com/expressjs/morgan
        // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
        format: process.env.LOG_FORMAT || 'combined',
        fileLogger: {
            directoryPath: process.env.LOG_DIR_PATH || process.cwd(),
            fileName: process.env.LOG_FILE || 'app.log',
            maxsize: 10485760,
            maxFiles: 2,
            json: false
        }
    },
    mailer: {
        from: process.env.MAILER_FROM || 'MAILER_FROM',
        options: {
            host: process.env.MAILER_HOST || 'MAILER_HOST',
            service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
            auth: {
                user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
                pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
            }
        }
    },
    googleShortenUrl: {
        clientSecret: process.env.GOOGLE_SHORTEN_URL_API_KEY
    },
    googleSendEmail: {
        clientSecret: process.env.GOOGLE_SEND_EMAIL_SCRIPT_KEY
    }
};