'use strict'

// set up the module
var logoutModule = angular.module('logout', ['app']);

// configure the module
logoutModule.config(['$routeProvider', function($routeProvider) {
    // set up the routes
    $routeProvider
        .when('/logout', {
            templateUrl: './logout/client/views/logout.html'
        })
}]);