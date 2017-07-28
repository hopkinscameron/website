angular.module('app').factory('BlogFactory', ['$http', '$location', function ($http, $location) {
    // set up the factory
    var factory = {};
    var appPath = $location.$$absUrl.split('#')[0] + 'api';

    // queries blog list 
    factory.queryBlogList = function (filter, pageNumber) {
        // set the endpoint
        var endpoint = appPath + "/blog";

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
        return $http(req).then(function (response) {
            return response.data;
        })
        .catch(function (response) {
            return { "error": true, "title": response.data.title, "status": response.status, "message": response.data.message };
        });
    };

    // gets blog post
    factory.getBlogPost = function (blogPostId) {
        // set the endpoint
        var endpoint = appPath + "/blog?id=" + blogPostId;

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
        return $http(req).then(function (response) {
            return response.data;
        })
        .catch(function (response) {
            return { "error": true, "title": response.data.title, "status": response.status, "message": response.data.message };
        });
    };

    // get new blog post page information
    factory.getSavedBlogDrafts = function () {
        // set the endpoint
        var endpoint = appPath + "/blog/drafts";

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
        return $http(req).then(function (response) {
            return response.data;
        })
        .catch(function (response) {
            return { "error": true, "title": response.data.title, "status": response.status, "message": response.data.message };
        });
    };

    // gets blog post edit page information 
    factory.getBlogPostEditPageInformation = function (blogPostId) {
        // set the endpoint
        var endpoint = appPath + "/blog/post/" + blogPostId + "/edit";

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
        return $http(req).then(function (response) {
            return response.data;
        })
        .catch(function (response) {
            return { "error": true, "title": response.data.title, "status": response.status, "message": response.data.message };
        });
    };

    // save blog
    factory.saveBlog = function (blogPostData) {
        // set the endpoint
        var endpoint = "/saveBlog";

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
        return $http(req).then(function (response) {
            return response.data;
        })
        .catch(function (response) {
            return { "error": true, "title": response.data.title, "status": response.status, "message": response.data.message };
        });
    };

    // post blog
    factory.postBlog = function (blogPostData) {
        // set the endpoint
        var endpoint = "/postBlog";

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
        return $http(req).then(function (response) {
            return response.data;
        })
        .catch(function (response) {
            return { "error": true, "title": response.data.title, "status": response.status, "message": response.data.message };
        });
    };

    // discard blog post draft
    factory.discardBlogPostDraft = function (blogPostId) {
        // set the endpoint
        var endpoint = "/discardSavedBlogDraft";

        // stringify the login data
        var blogStrigified = JSON.stringify({
            "id": blogPostId
        });

        // create request
        var req = {
            method: 'DELETE',
            url: endpoint,
            headers: {
                'Content-Type': 'application/json; odata=verbose',
                'Accept': 'application/json; odata=verbose'
            },
            data: blogStrigified
        };

        // send request
        return $http(req).then(function (response) {
            return response.data;
        })
        .catch(function (response) {
            return { "error": true, "title": response.data.title, "status": response.status, "message": response.data.message };
        });
    };

    // delete blog post
    factory.deleteBlogPost = function (blogPostId) {
        // set the endpoint
        var endpoint = "/deletePublishedBlog";

        // stringify the login data
        var blogStrigified = JSON.stringify({
            "id": blogPostId
        });

        // create request
        var req = {
            method: 'DELETE',
            url: endpoint,
            headers: {
                'Content-Type': 'application/json; odata=verbose',
                'Accept': 'application/json; odata=verbose'
            },
            data: blogStrigified
        };

        // send request
        return $http(req).then(function (response) {
            return response.data;
        })
        .catch(function (response) {
            return { "error": true, "title": response.data.title, "status": response.status, "message": response.data.message };
        });
    };

    return factory;
}]);