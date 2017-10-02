'use strict';

// set up the module
var coreModule = angular.module('core');

// trust the html
coreModule.filter('trustHTML', function ($sce) {
    return function (html) {
        return $sce.trustAsHtml(html);
    };
});