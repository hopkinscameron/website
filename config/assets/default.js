'use strict';

module.exports = {
    client: {
        lib: {
            css: [
                // bower:css
                'public/lib/bootstrap/bootstrap.css',
                'public/lib/bootstrap/bootstrap-theme.css',
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
                'public/lib/tinymce/tinymce.js',
                'public/lib/angular-ui-tinymce/dist/tinymce.min.js',
                //'public/lib/bootsrap/bootstrap.min.js',
                'public/lib/mark/mark.min.js',
                'public/lib/ng-dialog/ngDialog.min.js'
                // endbower
            ],
            tests: ['public/lib/angular/angular-mocks.js']
        },
        css: [
            'modules/*/client/{css,less,scss}/*.css',
            'modules/*/client/{css,less,scss}/**/*.css'
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
        files: [
            'modules/**/*/files/**/*.pdf'
        ],
        views: ['modules/*/client/views/**/*.html'],
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
        views: ['modules/*/server/views/*.html']
    }
};