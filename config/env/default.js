'use strict';

/**
 * Module dependencies.
 */
module.exports = {
    app: {
        title: 'Cameron Hopkins Personal Website',
        description: 'Full-Stack JavaScript with Express, AngularJS, and Node.js',
        keywords: 'express, angularjs, node.js, passport',
        googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID',
        appInsightsAnalyticsTrackingID: process.env.APP_INSIGHTS_ANALYTICS_TRACKING_ID || 'APP_INSIGHTS_ANALYTICS_TRACKING_ID'
    },
    db: {
        promise: global.Promise,
        options: { }
    },
    port: process.env.PORT || 3000,
    host: process.env.HOST || '0.0.0.0',
    // DOMAIN config should be set to the fully qualified application accessible
    // URL. For example: https://www.myapp.com (including port if required).
    domain: process.env.DOMAIN || 'http://127.0.0.1:80',
    // session options
    sessionOptions: {
        type: 'tingodb',
        dbPath: 'modules/login/server/models/db/sessions',
        ttl: 86400, // 86400 24 hours (in seconds) // 60 -> 1 minute
        timeout: 10000, 
        collectionName: 'sessions',
        secret: process.env.SESSION_SECRET || 'TEST',
        autoRemove: 'interval',
        autoRemoveInterval: 1
    },
    // session Cookie settings
    sessionCookie: {
        // session expiration is set by default to 24 hours (in milliseconds)
        maxAge: 24 * (60 * 60 * 1000), //24 * (60 * 60 * 1000), // 60000 -> 1 minute
        expires: 24 * (60 * 60 * 1000),
        // httpOnly flag makes sure the cookie is only accessed
        // through the HTTP protocol and not JS/browser
        httpOnly: true,
        // secure cookie should be turned to true to provide additional
        // layer of security so that the cookie is set only when working
        // in HTTPS mode.
        secure: false
    },
    // sessionKey is the cookie session name
    sessionKey: 'sessionId',
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
    logo: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'developmentp' ? 'public/dist/img/logo.jpg' : 'modules/core/client/img/brand/logo.jpg',
    favicon: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'developmentp' ? 'public/dist/img/favicon.ico' : 'modules/core/client/img/brand/favicon.ico',
    illegalUsernames: ['administrator', 'password', 'admin', 'user', 'unknown', 'anonymous', 'null', 'undefined', 'api'],
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
    },
    socialMedia: {
        facebook: {
            username: process.env.FACEBOOK_USERNAME || 'FACEBOOK_USERNAME'
        },
        instagram: {
            username: process.env.INSTAGRAM_USERNAME || 'INSTAGRAM_USERNAME'
        },
        linkedin: {
            username: process.env.LINKEDIN_USERNAME || 'LINKEDIN_USERNAME'
        },
        twitter: {
            username: process.env.TWITTER_USERNAME || 'TWITTER_USERNAME'
        },
        youtube: {
            channel: process.env.YOUTUBE_USERNAME || 'YOUTUBE_USERNAME'
        }
    }
};
