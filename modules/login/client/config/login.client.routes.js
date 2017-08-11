'use strict'

// set up the module
var loginModule = angular.module('login', ['app']);

// configure the module
loginModule.config(['$routeProvider', function($routeProvider) {
    // set up the routes
    $routeProvider
        .when('/login', {
            templateUrl: './login/client/views/login.html'
        })
}]);