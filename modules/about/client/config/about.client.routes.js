'use strict';

// set up the module
var aboutModule = angular.module('about', ['app']);

// configure the module
aboutModule.config(['$routeProvider', function($routeProvider) {
    // set up the routes
    $routeProvider
        .when('/about', {
            templateUrl: './about/client/views/about.html'
        })
}]);