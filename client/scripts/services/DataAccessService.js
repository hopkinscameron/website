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

    // gets the header based on type
    service.getHeaderInformation = function () {
        // set the endpoint
        var endpoint = "/client/data/header.json"; //"/api/header";

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
        var endpoint = "/client/data/footer.json"; //"/api/footer";

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
        var endpoint = "/client/data/home.json"; //"/api/home";

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
        var endpoint = "/client/data/about-me.json"; //"/api/aboutMe";

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
        var endpoint = "/client/data/resume.json"; //"/api/resume";

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
        var endpoint = "/client/data/portfolio.json"; //"/api/portfolio";

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
        var endpoint = "/client/data/over-drive.json"; //"/api/subportfolio?id=subPortfolioID";

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
        var endpoint = "/client/data/blog.json"; //"/api/blog";

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
        var endpoint = "/client/data/contact.json"; //"/api/contact";

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