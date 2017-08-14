'use strict';

// set up the module
var coreRoutesModule = angular.module('core.routes');

// configure the module
coreRoutesModule.config(['$routeProvider', function ($routeProvider, $routeParams) {
    $routeProvider
        .when('/not-found', {
            templateUrl: './core/client/views/error.html',
            controller: 'ErrorController'
        })
        .when('/bad-request', {
            templateUrl: './core/client/views/error.html',
            controller: 'ErrorController'
        })
        .otherwise({
            templateUrl: './core/client/views/error.html',
            controller: 'ErrorController'
        })
}]);