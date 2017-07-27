angular.module('app').factory('LoginFactory', ['$http', '$location', function ($http, $location) {
    // set up the factory
    var factory = {};
    var appPath = $location.$$absUrl.split('#')[0] + 'api';

    // checks if user is logged in
    factory.isUserLoggedIn = function () {
        // set the endpoint
        var endpoint = "/login";

        // create request
        var req = {
            method: 'GET',
            url: endpoint,
            headers: {
                'Content-Type': 'application/json; odata=verbose',
                'Accept': 'application/json; odata=verbose'
            },
            data: 'undefined'
        };

        // send request
        return $http(req).then(function (response) {
            return response.data;
        })
        .catch(function (response) {
            return { "error": true, "title": response.data.title, "status": response.status, "message": response.data.message };
        });
    };

    // login
    factory.login = function (credentials) {
        // set the endpoint
        var endpoint = "/login";

        // stringify the login data
        var loginStrigified = JSON.stringify({
            "username": credentials.username,
            "password": credentials.password
        });

        // create request
        var req = {
            method: 'POST',
            url: endpoint,
            headers: {
                'Content-Type': 'application/json; odata=verbose',
                'Accept': 'application/json; odata=verbose'
            },
            data: loginStrigified
        };

        // send request
        return $http(req).then(function (response) {
            return response.data;
        })
        .catch(function (response) {
            return { "error": true, "title": response.data.title, "status": response.status, "message": response.data.message };
        });
    };

    return factory;
}]);