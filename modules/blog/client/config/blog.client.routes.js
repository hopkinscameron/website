'use strict';

// set up the module
var blogRoutesModule = angular.module('blog.routes');

// configure the module
blogRoutesModule.config(['$routeProvider', function($routeProvider, $routeParams) {
    // set up the routes
    $routeProvider
        .when('/blog', {
            templateUrl: '/modules/blog/client/views/blog-list.client.view.html'
        })
        .when('/blog/new', {
            templateUrl: '/modules/blog/client/views/admin/blog-post-new.client.view.html',
            reloadOnSearch: false,
            authenticated: true
        })
        .when('/blog/post/:blogPostId', {
            templateUrl: '/modules/blog/client/views/blog-post.client.view.html'
        })
        .when('/blog/post/:blogPostId/edit', {
            templateUrl: '/modules/blog/client/views/admin/blog-post-edit.client.view.html',
            authenticated: true
        })
}]);