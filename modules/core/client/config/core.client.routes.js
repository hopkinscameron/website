'use strict';

// set up the module
var coreRoutesModule = angular.module('core.routes');

// configure the module
coreRoutesModule.config(['$routeProvider', function ($routeProvider, $routeParams) {
    $routeProvider
        .when('/bad-request', {
            templateUrl: '/modules/core/client/views/error.client.view.html',
            controller: 'ErrorController',
            errorCode: 400,
            errorTitle: 'Bad Request',
            errorMessage: 'Sorry, looks like you sent a bad request. Maybe try again?'
        })
        .when('/not-authorized', {
            templateUrl: '/modules/core/client/views/error.client.view.html',
            controller: 'ErrorController',
            errorCode: 401,
            errorTitle: 'Not Authorized',
            errorMessage: 'Sorry, looks like you you\'re not authorized to be here. Let\'s turn back and go somewhere else.'
        })
        .when('/forbidden', {
            templateUrl: '/modules/core/client/views/error.client.view.html',
            controller: 'ErrorController',
            errorCode: 403,
            errorTitle: 'Forbidden',
            errorMessage: 'Sorry, looks like you shouldn\'t be here. Guess there is nothing to see here. Let\'s keep it moving.'
        })
        .when('/not-found', {
            templateUrl: '/modules/core/client/views/error.client.view.html',
            controller: 'ErrorController',
            errorCode: 404,
            errorTitle: 'Page Not Found',
            errorMessage: 'Sorry, looks like the page you were looking for does not exist.'
        })
        .when('/internal-error', {
            templateUrl: '/modules/core/client/views/error.client.view.html',
            controller: 'ErrorController',
            errorCode: 500,
            errorTitle: 'Internal Error',
            errorMessage: 'Sorry, something went wrong on our end. We\'re going to fix that. Try reloading the page.'
        })
        .otherwise({
            templateUrl: '/modules/core/client/views/error.client.view.html',
            controller: 'ErrorController',
            errorCode: 404,
            errorTitle: 'Page Not Found',
            errorMessage: 'Sorry, looks like the page you were looking for does not exist.'
        })
}]);