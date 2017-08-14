'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
    livereload: true,
    app: {
        title: defaultEnvConfig.app.title + ' - Development Enviornment'
    },
    db: {
        uri: process.env.MONGODB || 'mongodb://localhost:27017/personal_website',
        options: {
            db: { 
                native_parser: true 
            },
            server: { 
                poolSize: 5 
            },
            user: '', // process.env.DB_USER
            pass: '' // process.env.DB_PASS
        },
        // Enable mongoose debug mode
        debug: process.env.MONGODB_DEBUG || false
    },
    log: {
        // logging with Morgan - https://github.com/expressjs/morgan
        // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
        format: 'dev',
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