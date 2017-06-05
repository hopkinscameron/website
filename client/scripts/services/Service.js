angular.module('app').service('Service', ['DataAccessService', function (DataAccessService) {

    // initialize the service
    var service = {};

    // TODO: set this in server
    // set the application name
    service.appName = "Cameron Hopkins";

    // the current path (after the hash)
    service.afterPath = "";

    // sends email to owner (me)
    service.sendEmailToOwner = function (emailData) {
        // sends email to owner (me)
        return DataAccessService.sendEmailToOwner(emailData).then(function (responseSE) {
            return { "error": false, "message": responseSE.data.message };
        })
        .catch(function (responseSE) {
            return { "error": true, "message": responseSE.data.message };
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

    // get the header infomation
    service.getHeaderInformation = function () {
        // access the header information
        return DataAccessService.getHeaderInformation().then(function (responseLI) {
            return responseLI.data;
        })
        .catch(function (responseLI) {
            return { "error": true, "message": responseLI.data.message };
        });
    };

    // get the footer infomation
    service.getFooterInformation = function () {
        // access the footer information
        return DataAccessService.getFooterInformation().then(function (responseF) {
            return responseF.data;
        })
        .catch(function (responseF) {
            return { "error": true, "message": responseF.data.message };
        });
    };

    // get home page data
    service.getHomePageData = function () {
        // access the home page information
        return DataAccessService.getHomePageInformation().then(function (responseH) {
            return responseH.data;
        })
        .catch(function (responseH) {
            return { "error": true, "message": responseH.data.message };
        });
    };

    // get about me page data
    service.getAboutMePageData = function () {
        // access the about me information
        return DataAccessService.getAboutMePageInformation().then(function (responseAM) {
            return responseAM.data;
        })
        .catch(function (responseAM) {
            return { "error": true, "message": responseAM.data.message };
        });
    };

    // get resume page data
    service.getResumePageData = function () {
        // access the resume information
        return DataAccessService.getResumePageInformation().then(function (responseR) {
            return responseR.data;
        })
        .catch(function (responseR) {
            return { "error": true, "message": responseR.data.message };
        });
    };

    // get portfolio page data
    service.getPortfolioPageData = function () {
        // access the portfolio information
        return DataAccessService.getPortfolioPageInformation().then(function (responseP) {
            return responseP.data;
        })
        .catch(function (responseP) {
            return { "error": true, "message": responseP.data.message };
        });
    };

    // get subportfolio page data
    service.getSubPortfolioPageData = function (subPortfolioID) {
        // access the subportfolio information
        return DataAccessService.getSubPortfolioPageInformation(subPortfolioID).then(function (responseSP) {
            return responseSP.data;
        })
        .catch(function (responseSP) {
            return { "error": true, "message": responseSP.data.message };
        });
    };

    // get blog page data
    service.getBlogPageData = function () {
        // access the blog information
        return DataAccessService.getBlogPageInformation().then(function (responseB) {
            return responseB.data;
        })
        .catch(function (responseB) {
            return { "error": true, "message": responseB.data.message };
        });
    };

    // get contact page data
    service.getContactPageData = function () {
        // access the contact information
        return DataAccessService.getContactPageInformation().then(function (responseC) {
            return responseC.data;
        })
        .catch(function (responseC) {
            return { "error": true, "message": responseC.data.message };
        });
    };

    return service;
}]);