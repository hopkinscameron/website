'use strict';

// get the main application
var app = angular.module('app');

// trust the url
app.filter('trustUrl', function ($sce) {
    return function (url) {
        return $sce.trustAsResourceUrl(url);
    };
});