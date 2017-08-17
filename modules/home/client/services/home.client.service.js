'use strict'

// set up the module
var homeServiceModule = angular.module('home.services');

// create the factory
homeServiceModule.factory('HomeFactory', ['$http', '$location', function ($http, $location) {
    // set up the factory
    var factory = {};
    var appPath = ApplicationConfiguration.applicationBase + 'api';

    // gets home page information 
    factory.getHomePageInformation = function () {
        // set the endpoint
        var endpoint = appPath + '/home';

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