angular.module('app').service('DataAccessService', ['$http', function ($http) {

    // initialize the service
    var service = {};

    // shortens url
    service.shortenURL = function (url) {
        // TODO: Change this so it's in the server instead

        // set the endpoint
        var endpoint = "/api/shortenUrl";

        // create request
        var req = {
            method: 'POST',
            url: "https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyCYsolMwCyuBfwc40byABSx5rF0soBgRUc",
            headers: {
                'Content-Type': 'application/json; odata=verbose',
                'Accept': 'application/json; odata=verbose'
            },
            data: '{"longUrl": "' + url + '"}'
        };
        return $http(req);
    };

    // sends email to owner (me)
    service.sendEmailToOwner = function (emailData) {
        // set the endpoint
        var endpoint = "/api/sendEmail";

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
        return $http(req);
    };

    // gets the header based on type
    service.getHeaderInformation = function () {
        // set the endpoint
        var endpoint = "/api/header";

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
        return $http(req);
    };

    // gets footer information 
    service.getFooterInformation = function () {
        // set the endpoint
        var endpoint = "/api/footer";

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
        return $http(req);
    };

    // gets home page information 
    service.getHomePageInformation = function () {
        // set the endpoint
        var endpoint = "/api/home";

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
        return $http(req);
    };

    // gets about me page information 
    service.getAboutMePageInformation = function () {
        // set the endpoint
        var endpoint = "/api/about";

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
        return $http(req);
    };

    // gets resume page information 
    service.getResumePageInformation = function () {
        // set the endpoint
        var endpoint = "/api/resume";

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
        return $http(req);
    };

    // gets portfolio page information 
    service.getPortfolioPageInformation = function () {
        // set the endpoint
        var endpoint = "/api/portfolio";

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
        return $http(req);
    };

    // gets subportfolio page information 
    service.getSubPortfolioPageInformation = function (subPortfolioID) {
        // set the endpoint
        var endpoint = "/api/portfolio?id=" + subPortfolioID;

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
        return $http(req);
    };

    // gets blog page information 
    service.getBlogPageInformation = function () {
        // set the endpoint
        var endpoint = "/api/blog";

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
        return $http(req);
    };

    // gets blog post page information 
    service.getBlogPostPageInformation = function (postID) {
        // set the endpoint
        var endpoint = "/api/blog?id=" + postID;

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
        return $http(req);
    };

    // gets contact page information 
    service.getContactPageInformation = function () {
        // set the endpoint
        var endpoint = "/api/contact";

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
        return $http(req);
    };

    return service;
}]);