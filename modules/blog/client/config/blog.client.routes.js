'use strict';

// set up the module
var blogModule = angular.module('blog', ['app']);

// configure the module
blogModule.config(['$routeProvider', function($routeProvider) {
    // set up the routes
    $routeProvider
        .when('/blog', {
            templateUrl: './blog/client/views/blog-list.html'/*,
            reloadOnSearch: false*/
        })
        .when('/blog/new', {
            templateUrl: './blog/client/views/admin/blog-post-new.html',
            reloadOnSearch: false
        })
        .when('/blog/post/:blogPostId', {
            templateUrl: './blog/client/views/blog-post.html'
        })
        .when('/blog/post/:blogPostId/edit', {
            templateUrl: './blog/client/views/admin/blog-post-edit.html'
        })
}]);