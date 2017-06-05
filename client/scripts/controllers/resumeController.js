angular.module('app').controller('resumeController', ['$scope', '$rootScope', '$compile', '$location', 'cfpLoadingBar', 'Service', function ($scope, $rootScope, $compile, $location, cfpLoadingBar, Service) {
    // set jQuery
    $ = window.jQuery;

    // set the path
    Service.afterPath = $location.path();

    // holds the page title
    $scope.pageTitle = "R&eacute;sum&eacute; | " + Service.appName;

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

    // get page data
    getPageData();

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

    // gets the page data
    function getPageData() {
        // get resume page data
        Service.getResumePageData().then(function (responseR) {
            // if returned a valid response
            if (!responseR.error) {
                // set the data
                $scope.resume = responseR;

                // setup page
                setUpPage();
            }
            else {
                // set error
                $scope.pageTitle = responseR.message;

                // set error
                $scope.error.error = true;
                $scope.error.message = responseR.message;

                // setup page
                setUpPage();
            }
        })
        .catch(function (responseR) {
            // set error
            $scope.pageTitle = responseR.message;

            // set error
            $scope.error.error = true;
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
    };
}]);