'use strict';

module.exports = {
    client: {
        lib: {
            css: [
                // bower:css
                'public/lib/bootstrap/bootstrap.css',
                'public/lib/bootstrap/bootstrap-reboot.css',
                'public/lib/bootstrap/bootstrap-grid.css',
                'public/lib/angular-loading-bar/loading-bar.css',
                'public/lib/font-awesome/font-awesome.css',
                'public/lib/ng-dialog/ngDialog-theme-default.min.css',
                'public/lib/ng-dialog/ngDialog-theme-plain.min.css',
                'public/lib/ng-dialog/ngDialog.min.css'
                // endbower
            ],
            js: [
                // bower:js
                //'public/lib/jquery/jquery-1.9.1.js',
                'public/lib/angular/angular.js',
                'public/lib/angular/angular-animate.js',
                'public/lib/angular/angular-cookies.js',
                'public/lib/angular/angular-route.js',
                'public/lib/angular/angular-sanitize.js',
                'public/lib/angular/angular-messages.js',
                'public/lib/angular/angular-touch.js',
                'public/lib/angular/angular-mocks.js',
                'public/lib/angular/angular-resource.js',
                'public/lib/angular-loading-bar/loading-bar.js',
                'public/lib/tinymce/tinymce.js',
                'public/lib/angular-ui-tinymce/src/tinymce.js',
                'public/lib/bootstrap/bootstrap.js',
                'public/lib/mark/mark.min.js',
                'public/lib/ng-dialog/ngDialog.js',
                'public/lib/chart.js/Chart.js',
                'public/lib/angular-chart/angular-chart.js',
                'public/lib/lodash/lodash.js'
                // endbower
            ],
            tests: ['public/lib/angular/angular-mocks.js']
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
        ],
        templates: ['build/templates.js']
    },
    server: {
        gulpConfig: ['gulpfile.js'],
        allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
        models: 'modules/*/server/models/**/*.js',
        routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
        sockets: 'modules/*/server/sockets/**/*.js',
        config: ['modules/*/server/config/*.js'],
        policies: 'modules/*/server/policies/*.js',
        views: ['modules/*/server/views/*.html'],
        index: [
            'modules/core/server/views/index.server.view.html',
            'modules/core/server/views/layout.server.view.html',
            'modules/core/server/index/index.server.view.html',
            'modules/core/server/index/layout.server.view.html'
        ]
    }
};