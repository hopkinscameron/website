'use strict'

// set up the module
var portfolioServiceModule = angular.module('portfolio.services');

// create the factory
portfolioServiceModule.factory('PortfolioFactory', ['$http', '$location', function ($http, $location) {
    // set up the factory
    var factory = {};
    var appPath = ApplicationConfiguration.applicationBase + 'api';

    // gets portfolio list page information 
    factory.getPortfolioListPageInformation = function () {
        // set the endpoint
        var endpoint = appPath + '/portfolio';

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

    // gets portfolio item page information 
    factory.getPortfolioItemPageInformation = function (portfolioItemId) {
        // set the endpoint
        var endpoint = appPath + '/portfolio/' + portfolioItemId;

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