'use strict';

// set up the module
var coreModule = angular.module('core');

// trust the url
coreModule.filter('trustUrl', function ($sce) {
    return function (url) {
        return $sce.trustAsResourceUrl(url);
    };
});