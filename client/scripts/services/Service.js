angular.module('app').service('OEAService', ['DataAccessService', 'DataParsingService', function (DataAccessService, DataParsingService) {

    // initialize the service
    var service = {};

    service.appName
    // the current path (after the hash)
    service.afterPath = "";

    // determines if the header/footer is currently displaying
    service.headerDisplayed = false;
    service.footerDisplayed = false;

    // get the header infomation
    service.getHeaderInformation = function (isUser, username) {
        // access the header information
        return DataAccessService.getHeaderInformation("loggedIn", isUser, username).then(function (responseLI) {
            // parse the data
            return DataParsingService.parseRawInformation(responseLI);
        })
        .catch(function (responseLI) {
            return { "error": true, "message": responseLI.data.message };
        });
    };

    // get the footer infomation
    service.getFooterInformation = function () {
        // access the footer information
        return DataAccessService.getFooterInformation().then(function (responseF) {
            // parse the data
            return DataParsingService.parseRawInformation(responseF);
        })
        .catch(function (responseF) {
            return { "error": true, "message": responseF.data.message };
        });
    };

    // get home page data
    service.getHomePageData = function () {
        // access the organization information
        return DataAccessService.getAllPublicOrgs().then(function (responseO) {
            // parse the data
            return DataParsingService.parseRawInformation(responseO);
        })
        .catch(function (responseO) {
            return { "error": true, "message": responseO.data.message };
        });
    };

    // shortens url
    service.shortenURL = function (url) {
        // shorten the url
        return DataAccessService.shortenURL(url)
        .catch(function (responseU) {
            return { "error": true, "message": responseU.data.message };
        });
    };

    return service;
}]);