'use strict';

// set up the module
var coreRoutesModule = angular.module('core.routes');

// configure the module
coreRoutesModule.config(['$routeProvider', function ($routeProvider, $routeParams) {
    $routeProvider
        .when('/not-found', {
            templateUrl: '/modules/core/client/views/error.html',
            controller: 'ErrorController'
        })
        .when('/bad-request', {
            templateUrl: '/modules/core/client/views/error.html',
            controller: 'ErrorController'
        })
        .otherwise({
            templateUrl: '/modules/core/client/views/error.html',
            controller: 'ErrorController'
        })
}]);