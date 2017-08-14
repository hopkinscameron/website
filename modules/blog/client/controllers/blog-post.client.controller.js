'use strict';

// set up the module
var blogModule = angular.module('blog');

// create the controller
blogModule.controller('BlogPostController', ['$scope', '$rootScope', '$compile', '$location', '$routeParams', '$timeout', 'Service', 'BlogFactory', function ($scope, $rootScope, $compile, $location, $routeParams, $timeout, Service, BlogFactory) {
    // determines if a page has already sent a request for load
    var pageRequested = false;
    
    // set jQuery
    $ = window.jQuery;

    // set the path
    Service.afterPath = $location.path();

    // holds the page title
    $scope.pageTitle = ApplicationConfiguration.applicationName;

    // get the parameters
    var blogPostId = $routeParams.blogPostId;

    // holds the error
    $scope.error = {
        'error': false,
        'title': '',
        'status': 404,
        'message': ''
    };

    // determines if the page is fully loaded
    $scope.pageFullyLoaded = false;

    // check if header/footer was initialized
    if($rootScope.$root.showHeader === undefined || $rootScope.$root.showFooter === undefined) {
        // refresh header
        $rootScope.$emit('refreshHeader', {});

        // refresh footer
        $rootScope.$emit('refreshFooter', {});
    }
    else {
        // always refresh header to ensure login
        $rootScope.$emit('refreshHeader', {});
    }

    // on header refresh
    $rootScope.$on('headerRefreshed', function (event, data) {
        // if footer still hasn't been initialized
        if($rootScope.$root.showFooter === undefined) {
            // refresh footer
            $rootScope.$emit('refreshFooter', {});
        }
        else {
            // initialize the page
            initializePage();
        }
    });

    // on footer refresh
    $rootScope.$on('footerRefreshed', function (event, data) {
        // if footer still hasn't been initialized
        if($rootScope.$root.showHeader === undefined) {
            // refresh header
            $rootScope.$emit('refreshHeader', {});
        }
        else {
            // initialize the page
            initializePage();
        }
    });
    
    // initialize page
    function initializePage() {
        // show the header if not shown     
        if (!$rootScope.$root.showHeader) {
            $rootScope.$root.showHeader = true;
        }

        // show the footer if not shown
        if (!$rootScope.$root.showFooter) {
            $rootScope.$root.showFooter = true;
        }

        // if page hasn't been requested yet
        if(!pageRequested) {
            pageRequested = true;

            // get page data
            getPageData();
        }
    };
    
    // gets the page data
    function getPageData() {        
        // get blog post
        BlogFactory.getBlogPost(blogPostId).then(function (responseBI) {
            // if returned a valid response
            if (!responseBI.error) {
                // set the data
                $scope.post = responseBI;
                $scope.post.title = 'Blog Post';
                $scope.pageTitle = responseBI.title + ' | ' + ApplicationConfiguration.applicationName;

                // setup page
                setUpPage();
            }
            else {
                // set error
                $scope.pageTitle = responseBI.title;
                $scope.error.error = true;
                $scope.error.title = responseBI.title;
                $scope.error.status = responseBI.status;
                $scope.error.message = responseBI.message;

                // setup page
                setUpPage();
            }
        })
        .catch(function (responseBI) {
            // set error
            $scope.pageTitle = responseBI.title;
            $scope.error.error = true;
            $scope.error.title = responseBI.title;
            $scope.error.status = responseBI.status;
            $scope.error.message = responseBI.message;

            // setup page
            setUpPage();
        });
    };

    // sets up the page
    function setUpPage() {
        // set up the title
        var titleDOM = document.getElementById('pageTitle');
        var title = '\'' + $scope.pageTitle + '\'';
        titleDOM.setAttribute('ng-bind-html', title);
        $compile(titleDOM)($scope);

        // set page fully loaded
        $scope.pageFullyLoaded = true;

        // show the page after a timeout
        $timeout(showPage, $rootScope.$root.showPageTimeout);
    };

    // shows the page
    function showPage() {
        // check if collapsing is already occuring
        if(!angular.element('#pageShow').hasClass('collapsing')) {
            // show the page
            angular.element('#pageShow').collapse('show');
        }
    };
}]);