angular.module('app').controller('aboutController', ['$scope', '$rootScope', '$compile', '$location', '$window', '$timeout', 'cfpLoadingBar','Service', function ($scope, $rootScope, $compile, $location, $window, $timeout, cfpLoadingBar, Service) {
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
    
    // TODO: may not need, might want to remove unless I figure out how to do this
    // on resize
    angular.element($window).on("scroll", function() {
        //console.log("scrolling");
        //console.log($window.scrollY);
        $scope.$apply(function () {
            // 
            if($window.scrollY >= 129 && !$scope.showHobbies) {
                $scope.showHobbies = true;
            }
        });
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

        // get page data
        getPageData();
    };

    // gets the page data
    function getPageData() {
        // get about me page data
        Service.getAboutMePageData().then(function (responseAM) {
            // if returned a valid response
            if (!responseAM.error) {
                // set the data
                $scope.about = responseAM;
                $scope.hobbiesColumnsPerRow = 4;
                $scope.hobbiesPerColumn = 3;
                $scope.hobbiesColumnsPerRowArray = new Array($scope.hobbiesColumnsPerRow);
                $scope.hobbiesMaxColumnCountArray = new Array(Math.ceil($scope.about.hobbies.length / $scope.hobbiesPerColumn));
                $scope.hobbiesMaxRowCountArray = new Array(Math.ceil($scope.hobbiesMaxColumnCountArray.length / $scope.hobbiesColumnsPerRow));
                $scope.hobbiesPerColumnsArray = new Array($scope.hobbiesPerColumn);

                $scope.favoriteGamesColumnsPerRow = 4;
                $scope.favoriteGamesMaxRowCountArray = new Array(Math.ceil($scope.about.favoriteGames.length / $scope.favoriteGamesColumnsPerRow));
                $scope.favoriteGamesColumnsPerRowArray = new Array($scope.favoriteGamesColumnsPerRow);
                
                // holds the animation times
                $scope.aboutAnimations = new Array(3);

                // the initial delayed start time of any animation
                var startTime = 1.5;

                // the incremental start time of every animation (every animation in the array has a value greater than the last by this much)
                var incrementTime = 1;

                // loop through all animation timing and set the times
                for(var x = 0; x < $scope.aboutAnimations.length; x++) {
                    
                    $scope.aboutAnimations[x] = {
                        'animation-delay': startTime + (x * incrementTime) + 's',
                        '-webkit-animation-delay': startTime + (x * incrementTime) + 's',
                        '-moz-animation-delay': startTime + (x * incrementTime) + 's'
                    };
                }

                // holds the page title
                $scope.pageTitle = "About Me | " + Service.appName;
                
                // setup page
                setUpPage();
            }
            else {
                // set error
                $scope.pageTitle = responseAM.title;
                $scope.error.error = true;
                $scope.error.title = responseAM.title;
                $scope.error.status = responseAM.status;
                $scope.error.message = responseAM.message;

                // setup page
                setUpPage();
            }
        })
        .catch(function (responseAM) {
            // set error
            $scope.pageTitle = responseAM.title;
            $scope.error.error = true;
            $scope.error.title = responseAM.title;
            $scope.error.status = responseAM.status;
            $scope.error.message = responseAM.message;

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