'use strict';

// set up the module
var dashboardRoutesModule = angular.module('dashboard.routes');

// configure the module
dashboardRoutesModule.config(['$routeProvider', function($routeProvider) {
    // set up the routes
    $routeProvider
        .when('/admin/dashboard', {
            templateUrl: '/modules/dashboard/client/views/admin/dashboard.client.view.html',
            authenticated: true
        })
}]);