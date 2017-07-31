﻿'use strict';

// load environment variables
require('dotenv').config();

module.exports = {
    app: {
        title: 'Cameron Hopkins Personal Website',
        description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
        keywords: 'mongodb, express, angularjs, node.js, mongoose, passport',
        googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
    },
    db: {
        promise: global.Promise
    },
    port: process.env.PORT || 3000,
    host: process.env.HOST || '0.0.0.0',
    // DOMAIN config should be set to the fully qualified application accessible
    // URL. For example: https://www.myapp.com (including port if required).
    domain: process.env.DOMAIN,
    // Session Cookie settings
    sessionCookie: {
        // session expiration is set by default to 24 hours (in milliseconds)
        maxAge: 24 * (60 * 60 * 1000),
        // httpOnly flag makes sure the cookie is only accessed
        // through the HTTP protocol and not JS/browser
        httpOnly: true,
        // secure cookie should be turned to true to provide additional
        // layer of security so that the cookie is set only when working
        // in HTTPS mode.
        secure: false
    },
    // sessionSecret should be changed for security measures and concerns
    sessionSecret: process.env.SESSION_SECRET | 'TEST',
    // sessionKey is the cookie session name
    sessionKey: 'sessionId',
    sessionCollection: 'sessions',
    saltRounds: parseInt(process.env.SALT_ROUNDS) || 10,
    // clear interval after session expires (in seconds)
    clearInterval: 60,
    // Lusca config
    csrf: {
        csrf: false,
        csp: false,
        xframe: 'SAMEORIGIN',
        p3p: 'ABCDEF',
        xssProtection: true
    },
    logo: 'modules/core/client/img/brand/logo.jpg',
    favicon: 'modules/core/client/img/brand/favicon.ico',
    illegalUsernames: ['administrator', 'password', 'admin', 'user',
        'unknown', 'anonymous', 'null', 'undefined', 'api'
    ],
    uploads: {
        profile: {
            image: {
                dest: '',
                limits: {
                    fileSize: 1 * 1024 * 1024 // Max file size in bytes (1 MB)
                }
            }
        }
    },
    shared: {
        owasp: {
            allowPassphrases: true,
            maxLength: 128,
            minLength: 10,
            minPhraseLength: 20,
            minOptionalTestsToPass: 4
        }
    }
};