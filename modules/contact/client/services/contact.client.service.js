'use strict';

angular.module('app').factory('ContactFactory', ['$http', '$location', function ($http, $location) {
    // set up the factory
    var factory = {};
    var appPath = $location.$$absUrl.split('#')[0] + 'api';

    // gets contact page information 
    factory.getContactPageInformation = function () {
        // set the endpoint
        var endpoint = appPath + "/contact";

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

    // sends email to owner (me)
    factory.sendEmailToOwner = function (emailData) {
        // set the endpoint
        var endpoint = "/sendEmail";

        // the data to send
        var data = JSON.stringify({
            "firstName": emailData.firstName,
            "lastName": emailData.lastName,
            "email": emailData.email,
            "subject": emailData.subject,
            "message": emailData.message
        });

        // create request
        var req = {
            method: 'POST',
            url: endpoint,
            headers: {
                'Content-Type': 'application/json; odata=verbose',
                'Accept': 'application/json; odata=verbose'
            },
            data: data
        };

        // send request
        return $http(req, { ignoreLoadingBar: true }).then(function (response) {
            return response.data;
        })
        .catch(function (response) {
            return { "error": true, "title": response.data.title, "status": response.status, "message": response.data.message };
        });
    };

    return factory;
}]);