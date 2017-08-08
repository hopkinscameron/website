angular.module('app').factory('BlogFactory', ['$http', '$location', function ($http, $location) {
    // set up the factory
    var factory = {};
    var appPath = $location.$$absUrl.split('#')[0] + 'api';

    // =========================================================================
    // Blog Functions ==========================================================
    // =========================================================================

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
            data: undefined
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
        var endpoint = appPath + "/blog/" + blogPostId;

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
        return $http(req).then(function (response) {
            return response.data;
        })
        .catch(function (response) {
            return { "error": true, "title": response.data.title, "status": response.status, "message": response.data.message };
        });
    };

    // creates blog post
    factory.createBlogPost = function (blogPostData) {
        // set the endpoint
        var endpoint = appPath + "/blog";        

        // stringify the draft data
        var blogStrigified = JSON.stringify({
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

    // saves published blog as a draft
    factory.savePublishedBlogAsDraft = function (blogPostData) {
        // set the endpoint
        var endpoint = appPath + "/blogDrafts";

        // stringify the draft data
        var draftStrigified = JSON.stringify({
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
            data: draftStrigified
        };

        // send request
        return $http(req).then(function (response) {
            return response.data;
        })
        .catch(function (response) {
            return { "error": true, "title": response.data.title, "status": response.status, "message": response.data.message };
        });
    };

    // updates blog post
    factory.updateBlogPost = function (blogPostData) {
        // set the endpoint
        var endpoint = appPath + "/blog/" + blogPostData.id;        

        // stringify the blog data
        var blogStrigified = JSON.stringify({
            "title": blogPostData.title,
            "image": blogPostData.image,
            "shortDescription": blogPostData.shortDescription,
            "body": blogPostData.body
        });

        // create request
        var req = {
            method: 'PUT',
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

    // deletes blog post
    factory.deleteBlogPost = function (blogPostId) {
        // set the endpoint
        var endpoint = appPath + "/blog/" + blogPostId;

        // create request
        var req = {
            method: 'DELETE',
            url: endpoint,
            headers: {
                'Content-Type': 'application/json; odata=verbose',
                'Accept': 'application/json; odata=verbose'
            },
            data: undefined
        };

        // send request
        return $http(req).then(function (response) {
            return response.data;
        })
        .catch(function (response) {
            return { "error": true, "title": response.data.title, "status": response.status, "message": response.data.message };
        });
    };
    
    // =========================================================================
    // Blog Draft Functions ==========================================================
    // =========================================================================

    // get saved blog drafts
    factory.getSavedBlogDrafts = function () {
        // set the endpoint
        var endpoint = appPath + "/blogDrafts";

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
        return $http(req).then(function (response) {
            return response.data;
        })
        .catch(function (response) {
            return { "error": true, "title": response.data.title, "status": response.status, "message": response.data.message };
        });
    };

    // gets blog blog draft 
    factory.getBlogDraft = function (blogPostId) {
        // set the endpoint
        var endpoint = appPath + "/blogDrafts/" + blogPostId;

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
        return $http(req).then(function (response) {
            return response.data;
        })
        .catch(function (response) {
            return { "error": true, "title": response.data.title, "status": response.status, "message": response.data.message };
        });
    };

    // saves blog draft
    factory.saveBlogDraft = function (blogDraftData) {
        // set the endpoint
        var endpoint = appPath + "/blogDrafts";

        // stringify the draft data
        var draftStrigified = JSON.stringify({
            "title": blogDraftData.title,
            "image": blogDraftData.image,
            "shortDescription": blogDraftData.shortDescription,
            "body": blogDraftData.body
        });

        // create request
        var req = {
            method: 'POST',
            url: endpoint,
            headers: {
                'Content-Type': 'application/json; odata=verbose',
                'Accept': 'application/json; odata=verbose'
            },
            data: draftStrigified
        };

        // send request
        return $http(req).then(function (response) {
            return response.data;
        })
        .catch(function (response) {
            return { "error": true, "title": response.data.title, "status": response.status, "message": response.data.message };
        });
    };

    // updates blog draft
    factory.updateBlogDraft = function (blogDraftData) {
        // set the endpoint
        var endpoint = appPath + "/blogDrafts/" + blogDraftData.id;

        // stringify the draft data
        var draftStrigified = JSON.stringify({
            "title": blogDraftData.title,
            "image": blogDraftData.image,
            "shortDescription": blogDraftData.shortDescription,
            "body": blogDraftData.body
        });

        // create request
        var req = {
            method: 'PUT',
            url: endpoint,
            headers: {
                'Content-Type': 'application/json; odata=verbose',
                'Accept': 'application/json; odata=verbose'
            },
            data: draftStrigified
        };

        // send request
        return $http(req).then(function (response) {
            return response.data;
        })
        .catch(function (response) {
            return { "error": true, "title": response.data.title, "status": response.status, "message": response.data.message };
        });
    };

    // posts blog draft
    factory.postBlogDraft = function (blogDraftData) {
        // set the endpoint
        var endpoint = appPath + "/blogDrafts/" + blogDraftData.id;      

        // stringify the draft data
        var draftStrigified = JSON.stringify({
            "title": blogDraftData.title,
            "image": blogDraftData.image,
            "shortDescription": blogDraftData.shortDescription,
            "body": blogDraftData.body
        });

        // create request
        var req = {
            method: 'POST',
            url: endpoint,
            headers: {
                'Content-Type': 'application/json; odata=verbose',
                'Accept': 'application/json; odata=verbose'
            },
            data: draftStrigified
        };

        // send request
        return $http(req).then(function (response) {
            return response.data;
        })
        .catch(function (response) {
            return { "error": true, "title": response.data.title, "status": response.status, "message": response.data.message };
        });
    };

    // discards blog post draft
    factory.discardBlogPostDraft = function (blogDraftId) {
        // set the endpoint
        var endpoint = appPath + "/blogDrafts/" + blogDraftId;

        // create request
        var req = {
            method: 'DELETE',
            url: endpoint,
            headers: {
                'Content-Type': 'application/json; odata=verbose',
                'Accept': 'application/json; odata=verbose'
            },
            data: undefined
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