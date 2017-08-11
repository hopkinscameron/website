'use strict'

// set up the module
var portfolioModule = angular.module('portfolio', ['app']);

// configure the module
portfolioModule.config(['$routeProvider', function($routeProvider) {
    // set up the routes
    $routeProvider
        .when('/portfolio', {
            templateUrl: './portfolio/client/views/portfolio-list.html'
        })
        .when('/portfolio/:portfolioItemId', {
            templateUrl: './portfolio/client/views/portfolio-item.html'
        })
}]);