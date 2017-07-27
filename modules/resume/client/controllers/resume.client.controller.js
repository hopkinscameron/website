angular.module('app').controller('ResumeController', ['$scope', '$rootScope', '$compile', '$location', '$timeout', 'cfpLoadingBar', 'Service', 'ResumeFactory', function ($scope, $rootScope, $compile, $location, $timeout, cfpLoadingBar, Service, ResumeFactory) {
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
    $scope.start = function() {
        // start loader
        cfpLoadingBar.start();
    };

    // on loading http intercepter complete
    $scope.complete = function () {
        // complete loader
        cfpLoadingBar.complete();
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
            getPageData();
        }
    };
    
    // gets the page data
    function getPageData() {
        // get resume page data
        ResumeFactory.getResumePageInformation().then(function (responseR) {
            // if returned a valid response
            if (!responseR.error) {
                // set the data
                $scope.resume = responseR;

                // the initial delayed start time of any animation
                var startTime = 1.5;

                // the incremental start time of every animation (every animation in the array has a value greater than the last by this much)
                var incrementTime = 1;

                // holds the animation times
                $scope.resumeAnimations = $rootScope.$root.getAnimationDelays(startTime, incrementTime, 2);

                // holds the page title
                $scope.pageTitle = "R&eacute;sum&eacute; | " + Service.appName;

                // setup page
                setUpPage();
            }
            else {
                // set error
                $scope.pageTitle = responseR.title;
                $scope.error.error = true;
                $scope.error.title = responseR.title;
                $scope.error.status = responseR.status;
                $scope.error.message = responseR.message;

                // setup page
                setUpPage();
            }
        })
        .catch(function (responseR) {
            // set error
            $scope.pageTitle = responseR.title;
            $scope.error.error = true;
            $scope.error.title = responseR.title;
            $scope.error.status = responseR.status;
            $scope.error.message = responseR.message;

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