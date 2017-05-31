angular.module('app').controller('homeController', ['$scope', '$rootScope', '$compile', '$location', 'cfpLoadingBar', 'Service', function ($scope, $rootScope, $compile, $location, cfpLoadingBar, Service) {
    // set jQuery
    $ = window.jQuery;

    // set the path
    Service.afterPath = $location.path();

    // holds the page title
    $scope.pageTitle = "Home - " + Service.appName;

    // holds the home backend data
    $scope.home = {
        "orgs": [],
        "state": false,
        "city": false,
        "school": false
    };

    // holds the search text
    $scope.searchText = {
        "all": "",
        "state": "",
        "city": "",
        "school": ""
    };

    // holds the error
    $scope.error = {
        "message": "",
        "error": false
    };

    // the number of items to display at a time
    $scope.itemThreshold = $rootScope.$root.initialArrayThreshold;

    // determines if the page is fully loaded
    $scope.pageFullyLoaded = false;

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

    // update filter criteria
    $scope.updateFilter = function () {
        $scope.searchText.state = $scope.home.state ? $rootScope.$root.currentUser.basicInfo.state : '';
        $scope.searchText.city = $scope.home.city ? $rootScope.$root.currentUser.basicInfo.city : '';
        $scope.searchText.school = $scope.home.school ? $rootScope.$root.currentUser.basicInfo.school : '';

        // reset each time a filter is updated
        $scope.itemThreshold = $rootScope.$root.initialArrayThreshold;
    };

    // load more items
    $scope.loadMore = function () {
        $scope.itemThreshold *= $rootScope.$root.nextArrayMultiplier;
    };

    // gets the home page data
    function getHomePageData() {
        // get home page data
        OEAService.getHomePageData().then(function (responseH) {
            // if returned a valid response
            if (!responseH.error) {
                // set the orgs
                $scope.home.orgs = responseH;

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