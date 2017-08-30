'use strict';

/**
 * Module dependencies.
 */
var // the default environment configuration
    defaultEnvConfig = require('./default'),
    // the file system to read/write from/to files locally
    fs = require('fs');

module.exports = {
    secure: {
        ssl: true,
        privateKey: './config/sslcerts/key.pem',
        certificate: './config/sslcerts/cert.pem',
        caBundle: './config/sslcerts/cabundle.crt'
    },
    db: {
        uri: process.env.MONGODB || 'mongodb://localhost:27017/personalwebsiteprodtest',
        options: {
            db: { 
                native_parser: true 
            },
            poolSize: 5,
            useMongoClient: true
            /**
              * Uncomment to enable ssl certificate based authentication to mongodb
              * servers. Adjust the settings below for your specific certificate
              * setup.
              * for connect to a replicaset, rename server:{...} to replset:{...}
            
            server: {
                ssl: true,
                sslValidate: false,
                checkServerIdentity: false,
                sslCA: fs.readFileSync('./config/sslcerts/ssl-ca.pem'),
                sslCert: fs.readFileSync('./config/sslcerts/ssl-cert.pem'),
                sslKey: fs.readFileSync('./config/sslcerts/ssl-key.pem'),
                sslPass: '1234'
            }*/
        },
        // enable mongoose debug mode
        debug: process.env.MONGODB_DEBUG || false
    },
    port: process.env.PORT_SECURE || 1337,
    // binding to 127.0.0.1 is safer in production.
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