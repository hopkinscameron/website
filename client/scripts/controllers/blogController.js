angular.module('app').controller('blogController', ['$scope', '$rootScope', '$compile', '$location', 'cfpLoadingBar', 'Service', function ($scope, $rootScope, $compile, $location, cfpLoadingBar, Service) {
    // set jQuery
    $ = window.jQuery;

    // set the path
    Service.afterPath = $location.path();

    // holds the page title
    $scope.pageTitle = "Blog | " + Service.appName;

    // holds the error
    $scope.error = {
        "message": "",
        "error": false
    };

    // determines if the page is fully loaded
    $scope.pageFullyLoaded = false;

    // show the header if not shown     
    if (!$rootScope.$root.showHeader) {
        $rootScope.$root.showHeader = true;
    }

    // show the footer if not shown
    if (!$rootScope.$root.showFooter) {
        $rootScope.$root.showFooter = true;
    }

    // search query
    $scope.search = {
        "query": ""
    };

    // get page data
    getPageData();

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

    // searches blogs based on text
    $scope.search = function () {
        // if no search text
        if($scope.search.query.length == 0) {
            $location.search("s", null);
        }
        else {
            $location.search("s", $scope.search.query);
        }

        // TODO: call API to update results
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

    // gets the page data
    function getPageData() {
        // get blog page data
        Service.getBlogPageData().then(function (responseB) {
            // if returned a valid response
            if (!responseB.error) {
                // set the data
                $scope.blog = responseB;

                // setup page
                setUpPage();
            }
            else {
                // set error
                $scope.pageTitle = responseB.message;

                // set error
                $scope.error.error = true;
                $scope.error.message = responseB.message;

                // setup page
                setUpPage();
            }
        })
        .catch(function (responseB) {
            // set error
            $scope.pageTitle = responseB.message;

            // set error
            $scope.error.error = true;
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
    };
}]);