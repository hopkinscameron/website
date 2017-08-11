'use strict';

// get the main application
var app = angular.module('app');

// trust the html
app.filter('trustHTML', function ($sce) {
    return function (html) {
        return $sce.trustAsHtml(html);
    };
});