'use strict'

// set up the module
var homeRoutesModule = angular.module('home.routes');

// configure the module
homeRoutesModule.config(['$routeProvider', function($routeProvider) {
    // set up the routes
    $routeProvider
        .when('/', {
            templateUrl: '../views/home.html'
        })
}]);