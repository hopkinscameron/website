'use strict';

// set up the module
var contactModule = angular.module('contact', ['app']);

// configure the module
contactModule.config(['$routeProvider', function($routeProvider) {
    // set up the routes
    $routeProvider
        .when('/contact', {
            templateUrl: './contact/client/views/contact.html'
        })
}]);