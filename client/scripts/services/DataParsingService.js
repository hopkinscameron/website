angular.module('app').service('DataParsingService', [function () {

    // initialize the service
    var service = {};

    // TODO: remove, put response.data in OEAService
    service.parseRawInformation = function (response) {
        // return the data
        return response.data;
    };

    return service;
}]);