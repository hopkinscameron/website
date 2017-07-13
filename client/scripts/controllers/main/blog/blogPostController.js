angular.module('app').controller('blogPostController', ['$scope', '$rootScope', '$compile', '$location', '$routeParams', '$timeout', 'cfpLoadingBar', 'Service', function ($scope, $rootScope, $compile, $location, $routeParams, $timeout, cfpLoadingBar, Service) {
    // determines if a page has already sent a request for load
    var pageRequested = false;
    
    // set jQuery
    $ = window.jQuery;

    // set the path
    Service.afterPath = $location.path();

    // holds the page title
    $scope.pageTitle = Service.appName;

    // get the parameters
    var postId = $routeParams.postId;

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
    $scope.start = function () {
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
        // get blog page data
        Service.getBlogPostPageData(postId).then(function (responseBP) {
            // if returned a valid response
            if (!responseBP.error) {
                // set the data
                $scope.post = responseBP;
                $scope.pageTitle = responseBP.title + " | " + Service.appName;

                // setup page
                setUpPage();
            }
            else {
                // set error
                $scope.pageTitle = responseBP.title;
                $scope.error.error = true;
                $scope.error.title = responseBP.title;
                $scope.error.status = responseBP.status;
                $scope.error.message = responseBP.message;

                // setup page
                setUpPage();
            }
        })
        .catch(function (responseBP) {
            // set error
            $scope.pageTitle = responseBP.title;
            $scope.error.error = true;
            $scope.error.title = responseBP.title;
            $scope.error.status = responseBP.status;
            $scope.error.message = responseBP.message;

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