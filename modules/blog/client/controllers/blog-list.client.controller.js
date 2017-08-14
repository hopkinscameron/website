'use strict';

// set up the module
var blogModule = angular.module('blog');

// create the controller
blogModule.controller('BlogListController', ['$scope', '$rootScope', '$compile', '$window', '$location', '$timeout', 'Service', 'BlogFactory', function ($scope, $rootScope, $compile, $window, $location, $timeout, Service, BlogFactory) {
    // determines if a page has already sent a request for load
    var pageRequested = false;

    // set jQuery
    $ = window.jQuery;

    // set the path
    Service.afterPath = $location.path();

    // holds the error
    $scope.error = {
        'error': false,
        'title': '',
        'status': 404,
        'message': ''
    };

    // search query
    $scope.searchText = {
        'query': ''
    };

    // set query
    $scope.searchText.query = $location.search().q === undefined ? '' : $location.search().q;

    // page threshold
    const threshold = 10;
    
    // set page number
    var pageNumber = $location.search().page == undefined ? 1 : parseInt($location.search().page);

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

    // checks if filter is active
    $scope.isFilterActive = function(filter) {
        var queries = $location.search();
         // if filters exist
        if(queries.q) {
            return queries.q.toLowerCase().indexOf(filter) != -1;
        }

        return false;
    };

    // on key press
    $scope.onKeyPress = function (event) {
        // if enter key
        if(event.which == 13 || event.keyCode == 13 || event.key == 'Enter' || event.key == 'NumpadEnter') {
            $scope.search();
        }
    };

    // searches blogs based on text
    $scope.search = function () {
        // if no search text
        if($scope.searchText.query.length == 0) {
            $location.search('q', null);
        }
        else {
            $location.search('q', $scope.searchText.query);
        }

        // setup the route
        var route = '#/blog';
        var searchQ = $location.search().q,
            page = $location.search().page;

        // if searching
        if(searchQ){
            route = '#/blog?q=' + searchQ;
        }

        // update location
        $window.location.href = route;
    };

    // add/remove filter to blog posts
    $scope.addRemoveFilter = function(filter) {
        var queries = $location.search();

        // if filters exist
        if(queries.q) {
            var queryArray = queries.q.toLowerCase().split('|');
            var i = queryArray.indexOf(filter.toLowerCase());
            
            // if specific query exist, remove
            if(i != -1) {
                queryArray.splice(i, 1);
                var q = queryArray.length > 0 ? queryArray.toString().replace(/,/g, '|') : null;
                $location.search('q', q);
            }
            else {
                // add
                $location.search('q', queries.q + '|' + filter);
            }
        }
        else {
            // add
            $location.search('q', filter);
        }

        // TODO: call API to update results
    };

    // determines if the page index should show
    $scope.shouldShowPageIndex = function (index) {
        const half = threshold / 2;
        const numLeft = pageNumber + threshold - $scope.blog.totalPages.length;

        // if page is less than threshold, show
        if(index < threshold && pageNumber < threshold) {
            return true;
        }
        // if greater than threshold, get before half and after half
        else if(pageNumber >= threshold && index + 1 >= pageNumber - half && index + 1 < pageNumber + half) {
            return true;
        }
    };

    // gets the fully quantified route value
    $scope.getRouteValue = function(index) {
        // setup the route
        var route = '#/blog?page=' + index;
        if($location.search().q){
            route = '#/blog?q=' + $location.search().q + '&page=' + index;
        }

        return route;
    };

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
            getPageData($scope.searchText.query, $location.search().page);
        }
    };

    // gets the page data
    function getPageData(filter, pageNumber) {
        // get blog page data
        BlogFactory.queryBlogList(filter, pageNumber).then(function (responseBL) {
            // if returned a valid response
            if (!responseBL.error) {
                // set the data
                $scope.blog = responseBL;
                $scope.blog.title = 'Blogs';
                $scope.blog.totalPages = new Array($scope.blog.totalPages);

                // the initial delayed start time of any animation
                var startTime = 1.5;

                // the incremental start time of every animation (every animation in the array has a value greater than the last by this much)
                var incrementTime = 1;

                // holds the animation times 
                $scope.blogAnimations = $rootScope.$root.getAnimationDelays(startTime, incrementTime, $scope.blog.posts.length);

                // holds the page title
                $scope.pageTitle = 'Blog | ' + ApplicationConfiguration.applicationName;

                // setup page
                setUpPage();
            }
            else {
                // set error
                $scope.pageTitle = responseBL.title;
                $scope.error.error = true;
                $scope.error.title = responseBL.title;
                $scope.error.status = responseBL.status;
                $scope.error.message = responseBL.message;

                // setup page
                setUpPage();
            }
        })
        .catch(function (responseBL) {
            // set error
            $scope.pageTitle = responseBL.title;
            $scope.error.error = true;
            $scope.error.title = responseBL.title;
            $scope.error.status = responseBL.status;
            $scope.error.message = responseBL.message;

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

            // when shown
            angular.element('#pageShow').on('shown.bs.collapse', function () {
                // the class and instance to which the mark will apply
                var context = document.querySelectorAll('.highlight-context');
                var markInstance = new Mark(context);
                
                // the keyword
                var keyword = $scope.searchText.query.split(' ');

                // the options
                var options = {
                    'element': 'span',
                    'className': 'highlight-text-foreground',
                    'separateWordSearch': true
                }

                // if there is a filter
                if($scope.searchText.query) {                    
                    // Remove previous marked elements and mark
                    // the new keyword inside the context
                    markInstance.unmark({
                        done: function(){
                            markInstance.mark(keyword, options);
                        }
                    });
                }
            });
        }
    };
}]);