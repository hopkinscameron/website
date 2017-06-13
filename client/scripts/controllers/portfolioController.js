angular.module('app').controller('portfolioController', ['$scope', '$rootScope', '$compile', '$location', 'cfpLoadingBar', 'Service', function ($scope, $rootScope, $compile, $location, cfpLoadingBar, Service) {
    // set jQuery
    $ = window.jQuery;

    // set the path
    Service.afterPath = $location.path();

    // holds the page title
    $scope.pageTitle = "Portfolio | " + Service.appName;

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
        // initialize the page
        initializePage();
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

        // get page data
        getPageData();
    };
    
    // gets the page data
    function getPageData() {
        // get portfolio page data
        Service.getPortfolioPageData().then(function (responseP) {
            // if returned a valid response
            if (!responseP.error) {
                // set the data
                $scope.portfolio = responseP;

                // setup page
                setUpPage();
            }
            else {
                // set error
                $scope.pageTitle = responseP.title;
                $scope.error.error = true;
                $scope.error.title = responseP.title;
                $scope.error.status = responseP.status;
                $scope.error.message = responseP.message;

                // setup page
                setUpPage();
            }
        })
        .catch(function (responseP) {
            // set error
            $scope.pageTitle = responseP.title;
            $scope.error.error = true;
            $scope.error.title = responseP.title;
            $scope.error.status = responseP.status;
            $scope.error.message = responseP.message;

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