'use strict';

// set up the module
var blogServiceModule = angular.module('blog.services');

// create the factory
blogServiceModule.factory('BlogFactory', ['$http', '$location', '$rootScope', function ($http, $location, $rootScope) {
    // set up the factory
    var factory = {};
    var appPath = ApplicationConfiguration.applicationBase + 'api';

    // =========================================================================
    // Blog Functions ==========================================================
    // =========================================================================

    // queries blog list 
    factory.queryBlogList = function (filter, pageNumber) {
        // set the endpoint
        var endpoint = appPath + '/blog';

        // if filter
        if(filter) {
            endpoint += '?q=' + filter;
        }

        // if page number
        if(pageNumber) {
            // if filter has been applied
            var delimeter = filter ? '&' : '?';
            endpoint += delimeter + 'page=' + pageNumber;
        }

        // create request
        var req = {
            method: 'GET',
            url: endpoint,
            data: undefined
        };

        // send request
        return $http(req).then(function (response) {
            return response.data.d;
        })
        .catch(function (response) {
            // if the response was sent back with the custom data response
            if(response.data) {
                return { 'error': true, 'title': response.data.title, 'status': response.status, 'message': response.data.message };
            }

            // return default response
            return { 'error': true, 'title': $rootScope.$root.generalStatusError, 'status': response.status, 'message': response.xhrStatus };
        });
    };

    // gets blog post
    factory.getBlogPost = function (blogPostId) {
        // set the endpoint
        var endpoint = appPath + '/blog/' + blogPostId;

        // create request
        var req = {
            method: 'GET',
            url: endpoint,
            data: undefined
        };

        // send request
        return $http(req).then(function (response) {
            return response.data.d;
        })
        .catch(function (response) {
            // if the response was sent back with the custom data response
            if(response.data) {
                return { 'error': true, 'title': response.data.title, 'status': response.status, 'message': response.data.message };
            }

            // return default response
            return { 'error': true, 'title': $rootScope.$root.generalStatusError, 'status': response.status, 'message': response.xhrStatus };
        });
    };

    // gets editable blog post
    factory.getEditableBlogPost = function (blogPostId) {
        // set the endpoint
        var endpoint = appPath + '/blog/' + blogPostId;

        // create request
        var req = {
            method: 'POST',
            url: endpoint,
            data: JSON.stringify({ 'editing': true })
        };

        // send request
        return $http(req).then(function (response) {
            return response.data.d;
        })
        .catch(function (response) {
            // if the response was sent back with the custom data response
            if(response.data) {
                return { 'error': true, 'title': response.data.title, 'status': response.status, 'message': response.data.message };
            }

            // return default response
            return { 'error': true, 'title': $rootScope.$root.generalStatusError, 'status': response.status, 'message': response.xhrStatus };
        });
    };

    // creates blog post
    factory.createBlogPost = function (blogPostData) {
        // set the endpoint
        var endpoint = appPath + '/blog';        

        // stringify the draft data
        var blogStrigified = JSON.stringify({
            'title': blogPostData.title,
            'image': blogPostData.image,
            'shortDescription': blogPostData.shortDescription,
            'body': blogPostData.body
        });

        // create request
        var req = {
            method: 'POST',
            url: endpoint,
            data: blogStrigified
        };

        // send request
        return $http(req).then(function (response) {
            return response.data.d;
        })
        .catch(function (response) {
            // if the response was sent back with the custom data response
            if(response.data) {
                return { 'error': true, 'title': response.data.title, 'status': response.status, 'message': response.data.message };
            }

            // return default response
            return { 'error': true, 'title': $rootScope.$root.generalStatusError, 'status': response.status, 'message': response.xhrStatus };
        });
    };

    // saves published blog as a draft
    factory.savePublishedBlogAsDraft = function (blogPostData) {
        // set the endpoint
        var endpoint = appPath + '/blogDrafts';

        // stringify the draft data
        var draftStrigified = JSON.stringify({
            'id': blogPostData.id,
            'title': blogPostData.title,
            'image': blogPostData.image,
            'shortDescription': blogPostData.shortDescription,
            'body': blogPostData.body
        });

        // create request
        var req = {
            method: 'POST',
            url: endpoint,
            data: draftStrigified
        };

        // send request
        return $http(req).then(function (response) {
            return response.data.d;
        })
        .catch(function (response) {
            // if the response was sent back with the custom data response
            if(response.data) {
                return { 'error': true, 'title': response.data.title, 'status': response.status, 'message': response.data.message };
            }

            // return default response
            return { 'error': true, 'title': $rootScope.$root.generalStatusError, 'status': response.status, 'message': response.xhrStatus };
        });
    };

    // updates blog post
    factory.updateBlogPost = function (blogPostData) {
        // set the endpoint
        var endpoint = appPath + '/blog/' + blogPostData.id;        

        // stringify the blog data
        var blogStrigified = JSON.stringify({
            'title': blogPostData.title,
            'image': blogPostData.image,
            'shortDescription': blogPostData.shortDescription,
            'body': blogPostData.body
        });

        // create request
        var req = {
            method: 'PUT',
            url: endpoint,
            data: blogStrigified
        };

        // send request
        return $http(req).then(function (response) {
            return response.data.d;
        })
        .catch(function (response) {
            // if the response was sent back with the custom data response
            if(response.data) {
                return { 'error': true, 'title': response.data.title, 'status': response.status, 'message': response.data.message };
            }

            // return default response
            return { 'error': true, 'title': $rootScope.$root.generalStatusError, 'status': response.status, 'message': response.xhrStatus };
        });
    };

    // deletes blog post
    factory.deleteBlogPost = function (blogPostId) {
        // set the endpoint
        var endpoint = appPath + '/blog/' + blogPostId;

        // create request
        var req = {
            method: 'DELETE',
            url: endpoint,
            data: undefined
        };

        // send request
        return $http(req).then(function (response) {
            return response.data.d;
        })
        .catch(function (response) {
            // if the response was sent back with the custom data response
            if(response.data) {
                return { 'error': true, 'title': response.data.title, 'status': response.status, 'message': response.data.message };
            }

            // return default response
            return { 'error': true, 'title': $rootScope.$root.generalStatusError, 'status': response.status, 'message': response.xhrStatus };
        });
    };
    
    // =========================================================================
    // Blog Draft Functions ==========================================================
    // =========================================================================

    // get saved blog drafts
    factory.getSavedBlogDrafts = function () {
        // set the endpoint
        var endpoint = appPath + '/blogDrafts';

        // create request
        var req = {
            method: 'GET',
            url: endpoint,
            data: undefined
        };

        // send request
        return $http(req).then(function (response) {
            return response.data.d;
        })
        .catch(function (response) {
            // if the response was sent back with the custom data response
            if(response.data) {
                return { 'error': true, 'title': response.data.title, 'status': response.status, 'message': response.data.message };
            }

            // return default response
            return { 'error': true, 'title': $rootScope.$root.generalStatusError, 'status': response.status, 'message': response.xhrStatus };
        });
    };

    // gets blog blog draft 
    factory.getBlogDraft = function (blogPostId) {
        // set the endpoint
        var endpoint = appPath + '/blogDrafts/' + blogPostId;

        // create request
        var req = {
            method: 'GET',
            url: endpoint,
            data: undefined
        };

        // send request
        return $http(req).then(function (response) {
            return response.data.d;
        })
        .catch(function (response) {
            // if the response was sent back with the custom data response
            if(response.data) {
                return { 'error': true, 'title': response.data.title, 'status': response.status, 'message': response.data.message };
            }

            // return default response
            return { 'error': true, 'title': $rootScope.$root.generalStatusError, 'status': response.status, 'message': response.xhrStatus };
        });
    };

    // gets editable blog draft
    factory.getEditableBlogDraft = function (blogPostId) {
        // set the endpoint
        var endpoint = appPath + '/blogDrafts/' + blogPostId + '?editing=true';

        // create request
        var req = {
            method: 'GET',
            url: endpoint,
            data: undefined
        };

        // send request
        return $http(req).then(function (response) {
            return response.data.d;
        })
        .catch(function (response) {
            // if the response was sent back with the custom data response
            if(response.data) {
                return { 'error': true, 'title': response.data.title, 'status': response.status, 'message': response.data.message };
            }

            // return default response
            return { 'error': true, 'title': $rootScope.$root.generalStatusError, 'status': response.status, 'message': response.xhrStatus };
        });
    };

    // saves blog draft
    factory.saveBlogDraft = function (blogDraftData) {
        // set the endpoint
        var endpoint = appPath + '/blogDrafts';

        // stringify the draft data
        var draftStrigified = JSON.stringify({
            'title': blogDraftData.title,
            'image': blogDraftData.image,
            'shortDescription': blogDraftData.shortDescription,
            'body': blogDraftData.body
        });

        // create request
        var req = {
            method: 'POST',
            url: endpoint,
            data: draftStrigified
        };

        // send request
        return $http(req).then(function (response) {
            return response.data.d;
        })
        .catch(function (response) {
            // if the response was sent back with the custom data response
            if(response.data) {
                return { 'error': true, 'title': response.data.title, 'status': response.status, 'message': response.data.message };
            }

            // return default response
            return { 'error': true, 'title': $rootScope.$root.generalStatusError, 'status': response.status, 'message': response.xhrStatus };
        });
    };

    // updates blog draft
    factory.updateBlogDraft = function (blogDraftData) {
        // set the endpoint
        var endpoint = appPath + '/blogDrafts/' + blogDraftData.id;

        // stringify the draft data
        var draftStrigified = JSON.stringify({
            'title': blogDraftData.title,
            'image': blogDraftData.image,
            'shortDescription': blogDraftData.shortDescription,
            'body': blogDraftData.body
        });

        // create request
        var req = {
            method: 'PUT',
            url: endpoint,
            data: draftStrigified
        };

        // send request
        return $http(req).then(function (response) {
            return response.data.d;
        })
        .catch(function (response) {
            // if the response was sent back with the custom data response
            if(response.data) {
                return { 'error': true, 'title': response.data.title, 'status': response.status, 'message': response.data.message };
            }

            // return default response
            return { 'error': true, 'title': $rootScope.$root.generalStatusError, 'status': response.status, 'message': response.xhrStatus };
        });
    };

    // posts blog draft
    factory.postBlogDraft = function (blogDraftData) {
        // set the endpoint
        var endpoint = appPath + '/blogDrafts/' + blogDraftData.id;      

        // stringify the draft data
        var draftStrigified = JSON.stringify({
            'title': blogDraftData.title,
            'image': blogDraftData.image,
            'shortDescription': blogDraftData.shortDescription,
            'body': blogDraftData.body
        });

        // create request
        var req = {
            method: 'POST',
            url: endpoint,
            data: draftStrigified
        };

        // send request
        return $http(req).then(function (response) {
            return response.data.d;
        })
        .catch(function (response) {
            // if the response was sent back with the custom data response
            if(response.data) {
                return { 'error': true, 'title': response.data.title, 'status': response.status, 'message': response.data.message };
            }

            // return default response
            return { 'error': true, 'title': $rootScope.$root.generalStatusError, 'status': response.status, 'message': response.xhrStatus };
        });
    };

    // discards blog post draft
    factory.discardBlogPostDraft = function (blogDraftId) {
        // set the endpoint
        var endpoint = appPath + '/blogDrafts/' + blogDraftId;

        // create request
        var req = {
            method: 'DELETE',
            url: endpoint,
            data: undefined
        };

        // send request
        return $http(req).then(function (response) {
            return response.data.d;
        })
        .catch(function (response) {
            // if the response was sent back with the custom data response
            if(response.data) {
                return { 'error': true, 'title': response.data.title, 'status': response.status, 'message': response.data.message };
            }

            // return default response
            return { 'error': true, 'title': $rootScope.$root.generalStatusError, 'status': response.status, 'message': response.xhrStatus };
        });
    };

    return factory;
}]);