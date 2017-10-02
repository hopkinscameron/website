'use strict';

// set up the module
var resumeRoutesModule = angular.module('resume.routes');

// configure the module
resumeRoutesModule.config(['$routeProvider', function($routeProvider) {
    // set up the routes
    $routeProvider
        .when('/resume', {
            templateUrl: '/modules/resume/client/views/resume.client.view.html'
        })
}]);