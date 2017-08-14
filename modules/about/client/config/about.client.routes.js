'use strict';

// set up the module
var aboutRoutesModule = angular.module('about.routes');

// configure the module
aboutRoutesModule.config(['$routeProvider', function($routeProvider) {
    // set up the routes
    $routeProvider
        .when('/about', {
            templateUrl: './about/client/views/about.html'
        })
}]);