'use strict'

angular.module('app').factory('LogoutFactory', ['$http', '$location', function ($http, $location) {
    // set up the factory
    var factory = {};
    var appPath = $location.$$absUrl.split('#')[0] + 'api';

    // logout
    factory.logout = function () {
        // set the endpoint
        var endpoint = "/logout";

        // create request
        var req = {
            method: 'GET',
            url: endpoint,
            headers: {
                'Content-Type': 'application/json; odata=verbose',
                'Accept': 'application/json; odata=verbose'
            },
            data: undefined
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