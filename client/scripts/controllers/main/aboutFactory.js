angular.module('app').factory('AboutFactory', ['$http', '$location', function ($http, $location) {
    // set up the factory
    var factory = {};
    var appPath = $location.$$absUrl.split('#')[0] + 'api';

    // gets about me page information 
    factory.getAboutMePageInformation = function () {
        // set the endpoint
        var endpoint = appPath + "/about";

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
        return $http(req).then(function (responseAM) {
            return responseAM.data;
        })
        .catch(function (responseAM) {
            return { "error": true, "title": responseAM.data.title, "status": responseAM.status, "message": responseAM.data.message };
        });
    };

    return factory;
}]);