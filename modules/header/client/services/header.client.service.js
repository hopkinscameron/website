'use strict'

// set up the module
var headerServiceModule = angular.module('header.services');

// create the factory
headerServiceModule.factory('HeaderFactory', ['$http', '$location', function ($http, $location) {
    // set up the factory
    var factory = {};
    var appPath = ApplicationConfiguration.applicationBase + 'api';

    // gets header information 
    factory.getHeaderInformation = function () {
        // set the endpoint
        var endpoint = appPath + '/header';

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

    return factory;
}]);