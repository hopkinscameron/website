'use strict';

// set up the module
var contactRoutesModule = angular.module('contact.routes');

// configure the module
contactRoutesModule.config(['$routeProvider', function($routeProvider) {
    // set up the routes
    $routeProvider
        .when('/contact', {
            templateUrl: './contact/client/views/contact.html'
        })
}]);