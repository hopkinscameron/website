'use strict'

// set up the module
var loginServiceModule = angular.module('login.services');

// create the factory
loginServiceModule.factory('LoginFactory', ['$http', '$location', function ($http, $location) {
    // set up the factory
    var factory = {};
    var appPath = ApplicationConfiguration.applicationBase + 'api';

    // checks if user is logged in
    factory.isUserLoggedIn = function () {
        // set the endpoint
        var endpoint = '/login';

        // create request
        var req = {
            method: 'GET',
            url: endpoint,
            data: undefined
        };

        // send request
        return $http(req).then(function (response) {
            return response.data.d;
        })
        .catch(function (response) {
            return { 'error': true, 'title': response.data.title, 'status': response.status, 'message': response.data.message };
        });
    };

    // login
    factory.login = function (credentials) {
        // set the endpoint
        var endpoint = '/login';

        // stringify the login data
        var loginStrigified = JSON.stringify({
            'username': credentials.username,
            'password': credentials.password
        });

        // create request
        var req = {
            method: 'POST',
            url: endpoint,
            data: loginStrigified
        };

        // send request
        return $http(req).then(function (response) {
            return response.data.d;
        })
        .catch(function (response) {
            return { 'error': true, 'title': response.data.title, 'status': response.status, 'message': response.data.message };
        });
    };

    return factory;
}]);