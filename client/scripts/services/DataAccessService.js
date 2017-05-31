angular.module('app').service('DataAccessService', ['$http', function ($http) {

    // initialize the service
    var service = {};

    // gets the header based on type
    service.getHeaderInformation = function (type, isUser, username) {
        var endpoint = "/api/private/header";

        // if this is admin
        if(type == "admin") {
            // add query
            endpoint += "?admin=true";
        }
        // if this is logged in
        else if(type == "loggedIn") {
            // add query
            endpoint += "?loggedIn=true&isUser=" + isUser + "&username=" + username;
        }
        // logged out
        else {
            // add query
            endpoint += "?loggedOut=true";
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

    // gets footer information 
    service.getFooterInformation = function (username) {
        var endpoint =  "/api/private/footer";

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

    // gets the user based on a username
    service.getPublicUserInformation = function (username) {
        var endpoint = "/api/public/users?username=" + username;

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

    // gets the org based on a username and (optional eventID)
    service.getPublicOrgInformation = function (username, eventID) {
        var endpoint = "/api/public/organizations?username=" + username;

        // if trying to obtain event information
        if(eventID !== undefined) {
            endpoint += "&eventID=" + eventID;
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

    // gets all organizations
    service.getAllPublicOrgs = function () {
        var endpoint = "/api/public/organizations?all=true";

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

    // registers the user
    service.registerUser = function (name, username, email, password) {
        var endpoint = "/api/public/register?user=true";
        var data = JSON.stringify({
            'name': name,
            'username': username,
            'email': email,
            'password': password
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

    // login the user
    service.loginUser = function (username, password) {
        var endpoint = "/api/login";
        var data = JSON.stringify({
            'username': username,
            'password': password
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

    // shortens url
    service.shortenURL = function (url) {
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

    return service;
}]);