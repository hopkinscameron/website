'use strict';

// set up the module
var blogRoutesModule = angular.module('blog.routes');

// configure the module
blogRoutesModule.config(['$routeProvider', function($routeProvider, $routeParams) {
    // set up the routes
    $routeProvider
        .when('/blog', {
            templateUrl: '/modules/blog/client/views/blog-list.html'/*,
            reloadOnSearch: false*/
        })
        .when('/blog/new', {
            templateUrl: '/modules/blog/client/views/admin/blog-post-new.html',
            reloadOnSearch: false
        })
        .when('/blog/post/:blogPostId', {
            templateUrl: '/modules/blog/client/views/blog-post.html'
        })
        .when('/blog/post/:blogPostId/edit', {
            templateUrl: '/modules/blog/client/views/admin/blog-post-edit.html'
        })
}]);