'use strict'

// set up the module
var portfolioRoutesModule = angular.module('portfolio.routes');

// configure the module
portfolioRoutesModule.config(['$routeProvider', function($routeProvider, $routeParams) {
    // set up the routes
    $routeProvider
        .when('/portfolio', {
            templateUrl: '/modules/portfolio/client/views/portfolio-list.html'
        })
        .when('/portfolio/:portfolioItemId', {
            templateUrl: '/modules/portfolio/client/views/portfolio-item.html'
        })
}]);