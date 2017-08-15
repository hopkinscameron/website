'use strict'

// set up the module
var loginRoutesModule = angular.module('login.routes');

// configure the module
loginRoutesModule.config(['$routeProvider', function($routeProvider) {
    // set up the routes
    $routeProvider
        .when('/login', {
            templateUrl: '/modules/login/client/views/login.html'
        })
}]);