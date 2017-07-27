angular.module('app').service('Service', ['DataAccessFactory', function (DataAccessFactory) {
    // set up the service
    var service = {};

    // the current path (after the hash)
    service.afterPath = "";

    // the app name
    service.appName = "";

    // set the application name
    service.setAppName = function () {
        // get app name
        return DataAccessFactory.getAppName().then(function (responseAN) {
            service.appName = responseAN.data.appName;
        })
        .catch(function (responseAN) {
            service.appName = "Cameron Hopkins";
        });
    };

    // shortens url
    service.shortenURL = function (url) {
        // shorten the url
        return DataAccessFactory.shortenURL(url)
        .catch(function (responseU) {
            return { "error": true, "title": responseU.data.title, "status": responseU.status, "message": responseU.data.message };
        });
    };

    return service;
}]);