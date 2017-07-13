angular.module('app').controller('blogController', ['$scope', '$rootScope', '$compile', '$location', '$timeout', 'cfpLoadingBar', 'Service', function ($scope, $rootScope, $compile, $location, $timeout, cfpLoadingBar, Service) {
    // determines if a page has already sent a request for load
    var pageRequested = false;

    // set jQuery
    $ = window.jQuery;

    // set the path
    Service.afterPath = $location.path();

    // holds the error
    $scope.error = {
        "error": false,
        "title": "",
        "status": 404,
        "message": ""
    };

    // search query
    $scope.searchText = {
        "query": ""
    };

    // set query
    $scope.searchText.query = $location.search().q === undefined ? "" : $location.search().q;

    // page threshold
    const threshold = 10;
    
    // set page number
    var pageNumber = $location.search().page == undefined ? 1 : parseInt($location.search().page);

    // determines if the page is fully loaded
    $scope.pageFullyLoaded = false;

    // check if header/footer was initialized
    if($rootScope.$root.showHeader === undefined || $rootScope.$root.showFooter === undefined) {
        // refresh header
        $rootScope.$emit("refreshHeader", {});

        // refresh footer
        $rootScope.$emit("refreshFooter", {});
    }
    else {
        // always refresh header to ensure login
        $rootScope.$emit("refreshHeader", {});
    }

    // on header refresh
    $rootScope.$on("headerRefreshed", function (event, data) {
        // if footer still hasn't been initialized
        if($rootScope.$root.showFooter === undefined) {
            // refresh footer
            $rootScope.$emit("refreshFooter", {});
        }
        else {
            // initialize the page
            initializePage();
        }
    });

    // on footer refresh
    $rootScope.$on("footerRefreshed", function (event, data) {
        // if footer still hasn't been initialized
        if($rootScope.$root.showHeader === undefined) {
            // refresh header
            $rootScope.$emit("refreshHeader", {});
        }
        else {
            // initialize the page
            initializePage();
        }
    });

    // on loading http intercepter start
    $scope.start = function () {
        // start loader
        cfpLoadingBar.start();
    };

    // on loading http intercepter complete
    $scope.complete = function () {
        // complete loader
        cfpLoadingBar.complete();
    };

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
        if(event.which == 13 || event.keyCode == 13 || event.key == "Enter" || event.key == "NumpadEnter") {
            $scope.search();
        }
    };

    // searches blogs based on text
    $scope.search = function () {
        // if no search text
        if($scope.searchText.query.length == 0) {
            $location.search("q", null);
        }
        else {
            $location.search("q", $scope.searchText.query);
        }

        // apply search/page filter
        getPageData($scope.searchText.query, $location.search().page);
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
                var q = queryArray.length > 0 ? queryArray.toString().replace(/,/g, "|") : null;
                $location.search("q", q);
            }
            else {
                // add
                $location.search("q", queries.q + "|" + filter);
            }
        }
        else {
            // add
            $location.search("q", filter);
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
        var route = "#/blog?page=" + index;
        if($location.search().q){
            route += "&q=" + $location.search().q;
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
        Service.getBlogPageData(filter, pageNumber).then(function (responseB) {
            // if returned a valid response
            if (!responseB.error) {
                // set the data
                $scope.blog = responseB;
                $scope.blog.totalPages = new Array($scope.blog.totalPages);
                $scope.blogAnimations = new Array($scope.blog.posts.length);

                // the initial delayed start time of any animation
                var startTime = 1.5;

                // the incremental start time of every animation (every animation in the array has a value greater than the last by this much)
                var incrementTime = 1;

                // loop through all animation timing and set the times
                for(var x = 0; x < $scope.blogAnimations.length; x++) {
                    
                    $scope.blogAnimations[x] = {
                        'animation-delay': startTime + (x * incrementTime) + 's',
                        '-webkit-animation-delay': startTime + (x * incrementTime) + 's',
                        '-moz-animation-delay': startTime + (x * incrementTime) + 's'
                    };
                }

                // holds the page title
                $scope.pageTitle = "Blog | " + Service.appName;

                // setup page
                setUpPage();
            }
            else {
                // set error
                $scope.pageTitle = responseB.title;
                $scope.error.error = true;
                $scope.error.title = responseB.title;
                $scope.error.status = responseB.status;
                $scope.error.message = responseB.message;

                // setup page
                setUpPage();
            }
        })
        .catch(function (responseB) {
            // set error
            $scope.pageTitle = responseB.title;
            $scope.error.error = true;
            $scope.error.title = responseB.title;
            $scope.error.status = responseB.status;
            $scope.error.message = responseB.message;

            // setup page
            setUpPage();
        });
    };

    // sets up the page
    function setUpPage() {
        // set up the title
        var titleDOM = document.getElementById("pageTitle");
        var title = "\'" + $scope.pageTitle + "\'";
        titleDOM.setAttribute("ng-bind-html", title);
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
                var context = document.querySelectorAll(".highlight-context");
                var markInstance = new Mark(context);
                
                // the keyword
                var keyword = $scope.searchText.query.split(" ");

                // the options
                var options = {
                    "element": "span",
                    "className": "highlight-text-foreground",
                    "separateWordSearch": true
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