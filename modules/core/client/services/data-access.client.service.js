angular.module('app').factory('DataAccessFactory', ['$http', '$location', function ($http, $location) {
    // set up the factory
    var factory = {};
    var appPath = $location.$$absUrl.split('#')[0] + 'api';

    // gets app name
    factory.getAppName = function () {
        // set the endpoint
        var endpoint = appPath + "/appName";

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
        return $http(req);
    };

    // shortens url
    factory.shortenURL = function (url) {
        // set the endpoint
        var endpoint = appPath + "/shortenUrl";

        // stringify the url data
        var urlData = JSON.stringify({
            "longUrl": url
        });

        // create request
        var req = {
            method: 'POST',
            url: endpoint,
            headers: {
                'Content-Type': 'application/json; odata=verbose',
                'Accept': 'application/json; odata=verbose'
            },
            data: urlData
        };

        // send request
        return $http(req);
    };

    return factory;
}]);