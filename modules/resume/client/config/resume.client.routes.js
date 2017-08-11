'use strict'

// set up the module
var resumeModule = angular.module('resume', ['app']);

// configure the module
resumeModule.config(['$routeProvider', function($routeProvider) {
    // set up the routes
    $routeProvider
        .when('/resume', {
            templateUrl: './resume/client/views/resume.html'
        })
}]);