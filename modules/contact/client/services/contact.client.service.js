'use strict';

// set up the module
var contactServiceModule = angular.module('contact.services');

// create the factory
contactServiceModule.factory('ContactFactory', ['$http', '$location', function ($http, $location) {
    // set up the factory
    var factory = {};
    var appPath = ApplicationConfiguration.applicationBase + 'api';

    // gets contact page information 
    factory.getContactPageInformation = function () {
        // set the endpoint
        var endpoint = appPath + '/contact';

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

    // sends email to owner (me)
    factory.sendEmailToOwner = function (emailData) {
        // set the endpoint
        var endpoint = appPath + '/sendEmail';

        // the data to send
        var data = JSON.stringify({
            'firstName': emailData.firstName,
            'lastName': emailData.lastName,
            'email': emailData.email,
            'subject': emailData.subject,
            'message': emailData.message
        });

        // send request
        return $http.post(endpoint, data, { ignoreLoadingBar: true }).then(function (response) {
            return response.data;
        })
        .catch(function (response) {
            return { 'error': true, 'title': response.data.title, 'status': response.status, 'message': response.data.message };
        });
    };

    return factory;
}]);