angular.module('app').controller('homeController', ['$scope', '$rootScope', '$compile', '$location', 'cfpLoadingBar', 'Service', function ($scope, $rootScope, $compile, $location, cfpLoadingBar, Service) {
    // set jQuery
    $ = window.jQuery;

    // set the path
    Service.afterPath = $location.path();

    // holds the page title
    $scope.pageTitle = "Home | " + Service.appName;

    // holds the error
    $scope.error = {
        "message": "",
        "error": false
    };

    // determines if the page is fully loaded
    $scope.pageFullyLoaded = false;

    // hide the header if displayed     
    if (Service.headerDisplayed) {
        Service.headerDisplayed = false;
    }

    // hide the footer if displayed
    if (Service.footerDisplayed) {
        Service.headerDisplayed = true;
    }

    // show the home body display
    showBodyHomeID()

    // get home page data
    getHomePageData();

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

    // gets the home page data
    function getHomePageData() {
        // get home page data
        Service.getHomePageData().then(function (responseH) {
            // if returned a valid response
            if (!responseH.error) {
                // set the home data
                $scope.home = responseH;

                // setup page
                setUpPage();
            }
            else {
                // set error
                $scope.pageTitle = responseH.message;

                // set error
                $scope.error.error = true;
                $scope.error.message = responseH.message;

                // setup page
                setUpPage();
            }
        })
        .catch(function (responseH) {
            // set error
            $scope.pageTitle = responseH.message;

            // set error
            $scope.error.error = true;
            $scope.error.message = responseH.message;

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