'use strict'

angular.module('app').controller('PortfolioListController', ['$scope', '$rootScope', '$compile', '$location', '$timeout', 'cfpLoadingBar', 'Service', 'PortfolioFactory', function ($scope, $rootScope, $compile, $location, $timeout, cfpLoadingBar, Service, PortfolioFactory) {
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

    // set current path
    $scope.currentPath = $location.path();

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

    // gets the title of the picture
    $scope.getPictureTitle = function (pictureLink) {
        //split string
        var splits = pictureLink.split('/');
        return splits[splits.length - 1];
    };

    // go to subpage link
    $scope.goToSubPageLink = function (subPageLink) {
        var path = $location.path + "/" + subPageLink;
        $location.path($location.path + "/" + subPageLink);
    }

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
        // get portfolio list page data
        PortfolioFactory.getPortfolioListPageInformation().then(function (responsePL) {
            // if returned a valid response
            if (!responsePL.error) {
                // set the data
                $scope.portfolio = responsePL;
                $scope.portfolio.title = 'Portfolio';

                // the initial delayed start time of any animation
                var startTime = 1.5;

                // the incremental start time of every animation (every animation in the array has a value greater than the last by this much)
                var incrementTime = 1;

                // holds the animation times
                $scope.portfolioAnimations = $rootScope.$root.getAnimationDelays(startTime, incrementTime, $scope.portfolio.portfolioItems.length);

                // holds the page title
                $scope.pageTitle = "Portfolio | " + Service.appName;

                // setup page
                setUpPage();
            }
            else {
                // set error
                $scope.pageTitle = responsePL.title;
                $scope.error.error = true;
                $scope.error.title = responsePL.title;
                $scope.error.status = responsePL.status;
                $scope.error.message = responsePL.message;

                // setup page
                setUpPage();
            }
        })
        .catch(function (responsePL) {
            // set error
            $scope.pageTitle = responsePL.title;
            $scope.error.error = true;
            $scope.error.title = responsePL.title;
            $scope.error.status = responsePL.status;
            $scope.error.message = responsePL.message;

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
        }
    };
}]);