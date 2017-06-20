angular.module('app').service('DataAccessService', ['$http', function ($http) {

    // initialize the service
    var service = {};

    // gets app name
    service.getAppName = function () {
        // set the endpoint
        var endpoint = "/api/appName";

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
        return $http(req);
    };

    // shortens url
    service.shortenURL = function (url) {
        // set the endpoint
        var endpoint = "/api/shortenUrl";

        // stringify the url data
        var urlData = JSON.stringify({
            "longUrl": url
        });

        // create request
        var req = {
            method: 'POST',
            url: endpoint,
            headers: {
                'Content-Type': 'application/json; odata=verbose',
                'Accept': 'application/json; odata=verbose'
            },
            data: urlData
        };

        // send request
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
    service.getBlogPageInformation = function (filter, pageNumber) {
        // set the endpoint
        var endpoint = "/api/blog";

        // if filter
        if(filter) {
            endpoint += "?q=" + filter;
        }

        // if page number
        if(pageNumber) {
            // if filter has been applied
            var delimeter = filter ? "&" : "?";
            endpoint += delimeter + "page=" + pageNumber;
        }

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

    // login
    service.login = function (loginData) {
        // set the endpoint
        var endpoint = "/api/login";

        // stringify the login data
        var loginStrigified = JSON.stringify({
            "username": loginData.username,
            "password": loginData.password
        });

        // create request
        var req = {
            method: 'POST',
            url: endpoint,
            headers: {
                'Content-Type': 'application/json; odata=verbose',
                'Accept': 'application/json; odata=verbose'
            },
            data: loginStrigified
        };

        // send request
        return $http(req);
    };

    // get admin page information
    service.getAdminPageInformation = function () {
        // set the endpoint
        var endpoint = "/api/admin";

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

    // save blog
    service.saveBlog = function (blogPostData) {
        // set the endpoint
        var endpoint = "/api/saveBlog";

        // stringify the login data
        var blogStrigified = JSON.stringify({
            "id": blogPostData.id,
            "title": blogPostData.title,
            "image": blogPostData.image,
            "shortDescription": blogPostData.shortDescription,
            "body": blogPostData.body
        });

        // create request
        var req = {
            method: 'POST',
            url: endpoint,
            headers: {
                'Content-Type': 'application/json; odata=verbose',
                'Accept': 'application/json; odata=verbose'
            },
            data: blogStrigified
        };

        // send request
        return $http(req);
    };

    // post blog
    service.postBlog = function (blogPostData) {
        // set the endpoint
        var endpoint = "/api/postBlog";

        // stringify the login data
        var blogStrigified = JSON.stringify({
            "id": blogPostData.id,
            "title": blogPostData.title,
            "image": blogPostData.image,
            "shortDescription": blogPostData.shortDescription,
            "body": blogPostData.body
        });

        // create request
        var req = {
            method: 'POST',
            url: endpoint,
            headers: {
                'Content-Type': 'application/json; odata=verbose',
                'Accept': 'application/json; odata=verbose'
            },
            data: blogStrigified
        };

        // send request
        return $http(req);
    };

    return service;
}]);