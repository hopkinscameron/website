'use strict';

module.exports = {
    client: {
        lib: {
            css: [
                // bower:css
                'public/lib/bootstrap/bootstrap.min.css',
                'public/lib/bootstrap/bootstrap-reboot.min.css',
                'public/lib/bootstrap/bootstrap-grid.min.css',
                'public/lib/angular-loading-bar/loading-bar.min.css',
                'public/lib/font-awesome/font-awesome.min.css',
                'public/lib/ng-dialog/ngDialog-theme-default.min.css',
                'public/lib/ng-dialog/ngDialog-theme-plain.min.css',
                'public/lib/ng-dialog/ngDialog.min.css'
                // endbower
            ],
            js: [
                // bower:js
                //'public/lib/jquery/jquery-1.9.1.min.js',
                'public/lib/angular/angular.min.js',
                'public/lib/angular/angular-animate.min.js',
                'public/lib/angular/angular-cookies.min.js',
                'public/lib/angular/angular-route.min.js',
                'public/lib/angular/angular-sanitize.min.js',
                'public/lib/angular/angular-messages.min.js',
                'public/lib/angular/angular-touch.min.js',
                'public/lib/angular/angular-mocks.min.js',
                'public/lib/angular/angular-resource.min.js',
                'public/lib/angular-loading-bar/loading-bar.min.js',
                'public/lib/tinymce/tinymce.min.js',
                'public/lib/angular-ui-tinymce/dist/tinymce.min.js',
                'public/lib/bootstrap/bootstrap.min.js',
                'public/lib/mark/mark.min.js',
                'public/lib/ng-dialog/ngDialog.min.js'
                // endbower
            ]
        },
        css: [
            'modules/*/client/{css,less,scss}/*.css'
        ],
        less: [
            'modules/*/client/less/*.less'
        ],
        sass: [
            'modules/*/client/scss/*.scss',
            'modules/core/client/css/**/*.scss'
        ],
        js: [
            'modules/core/client/app/config.js',
            'modules/core/client/app/init.js',
            'modules/*/client/*.js',
            'modules/*/client/**/*.js'
        ],
        img: [
            'modules/**/*/img/**/*.jpg',
            'modules/**/*/img/**/*.png',
            'modules/**/*/img/**/*.gif',
            'modules/**/*/img/**/*.svg'
        ],
        icons: [
            'modules/**/*/img/**/*.ico'
        ],
        files: [
            'modules/**/*/files/**/*.pdf'
        ],
        views: ['modules/*/client/views/**/*.html'],
        fonts: [
            'modules/*/client/{css,less,scss}/fonts/*.{eot,otf,ttf,woff,woff2}'
        ]
    }
};