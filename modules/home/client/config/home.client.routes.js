'use strict'

// set up the module
var homeModule = angular.module('home', ['app']);

// configure the module
homeModule.config(['$routeProvider', function($routeProvider) {
    // set up the routes
    $routeProvider
        .when('/', {
            templateUrl: '../views/home.html'
        })
}]);