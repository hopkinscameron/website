angular.module('app').factory('HomeFactory', ['$http', '$location', function ($http, $location) {
    // set up the factory
    var factory = {};
    var appPath = $location.$$absUrl.split('#')[0] + 'api';

    // gets home page information 
    factory.getHomePageInformation = function () {
        // set the endpoint
        var endpoint = appPath + "/home";

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

    return factory;
}]);