'use strict'

// set up the module
var logoutRoutesModule = angular.module('logout.routes');

// configure the module
logoutRoutesModule.config(['$routeProvider', function($routeProvider) {
    // set up the routes
    $routeProvider
        .when('/logout', {
            templateUrl: '/modules/logout/client/views/logout.html'
        })
}]);