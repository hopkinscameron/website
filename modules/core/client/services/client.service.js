'use strict';

// set up the module
var coreServicesModule = angular.module('core.services');

// create the service
coreServicesModule.service('Service', [function () {
    // set up the service
    var service = {};

    // the current path (after the hash)
    service.afterPath = '';

    return service;
}]);