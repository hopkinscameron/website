'use strict';

// set up the module
var aboutModule = angular.module('about');

// create the controller
aboutModule.controller('AboutController', ['$scope', '$rootScope', '$compile', '$location', '$window', '$timeout', 'Service', 'AboutFactory', function ($scope, $rootScope, $compile, $location, $window, $timeout, Service, AboutFactory) {
    // determines if a page has already sent a request for load
    var pageRequested = false;

    // set jQuery
    $ = window.jQuery;

    // set the path
    Service.afterPath = $location.path();

    // holds the error
    $scope.error = {
        'error': false,
        'title': '',
        'status': 404,
        'message': ''
    };

    // determines if the page is fully loaded
    $scope.pageFullyLoaded = false;

    // check if header/footer was initialized
    if($rootScope.$root.showHeader === undefined || $rootScope.$root.showFooter === undefined) {
        // refresh header
        $rootScope.$emit('refreshHeader', {});

        // refresh footer
        $rootScope.$emit('refreshFooter', {});
    }
    else {
        // always refresh header to ensure login
        $rootScope.$emit('refreshHeader', {});
    }

    // on header refresh
    $rootScope.$on('headerRefreshed', function (event, data) {
        // if footer still hasn't been initialized
        if($rootScope.$root.showFooter === undefined) {
            // refresh footer
            $rootScope.$emit('refreshFooter', {});
        }
        else {
            // initialize the page
            initializePage();
        }
    });

    // on footer refresh
    $rootScope.$on('footerRefreshed', function (event, data) {
        // if footer still hasn't been initialized
        if($rootScope.$root.showHeader === undefined) {
            // refresh header
            $rootScope.$emit('refreshHeader', {});
        }
        else {
            // initialize the page
            initializePage();
        }
    });

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
            // set page has been requested
            pageRequested = true;

            // show the page after a timeout
            $timeout(getPageData, $rootScope.$root.getPageDataTimeout);
        }
    };

    // gets the page data
    function getPageData() {
        // get about me page data
        AboutFactory.getAboutMePageInformation().then(function (responseAM) {
            // if returned a valid response
            if (!responseAM.error) {
                // set the data
                $scope.about = responseAM;
                $scope.about.title = 'About Me';
                $scope.hobbiesColumnsPerRow = 4;
                $scope.hobbiesPerColumn = 3;
                $scope.hobbiesColumnsPerRowArray = new Array($scope.hobbiesColumnsPerRow);
                $scope.hobbiesMaxColumnCountArray = new Array(Math.ceil($scope.about.hobbies.length / $scope.hobbiesPerColumn));
                $scope.hobbiesMaxRowCountArray = new Array(Math.ceil($scope.hobbiesMaxColumnCountArray.length / $scope.hobbiesColumnsPerRow));
                $scope.hobbiesPerColumnsArray = new Array($scope.hobbiesPerColumn);

                $scope.favoriteGamesColumnsPerRow = 4;
                $scope.favoriteGamesMaxRowCountArray = new Array(Math.ceil($scope.about.favoriteGames.length / $scope.favoriteGamesColumnsPerRow));
                $scope.favoriteGamesColumnsPerRowArray = new Array($scope.favoriteGamesColumnsPerRow);
                
                // if there more columns than necessary
                if($scope.hobbiesColumnsPerRowArray.length > $scope.hobbiesMaxColumnCountArray.length) {
                    $scope.hobbiesColumnsPerRowArray = new Array($scope.hobbiesMaxColumnCountArray.length);
                }

                // if there more columns than necessary
                if($scope.favoriteGamesColumnsPerRowArray.length > $scope.favoriteGamesColumnsPerRow) {
                    $scope.favoriteGamesColumnsPerRowArray = new Array($scope.favoriteGamesColumnsPerRow);
                }

                // holds the animation time
                $scope.animationStyle = $rootScope.$root.getAnimationDelay();

                // holds the page title
                $scope.pageTitle = 'About Me | ' + ApplicationConfiguration.applicationName;
                
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
        var titleDOM = document.getElementById('pageTitle');
        var title = '\'' + $scope.pageTitle + '\'';
        titleDOM.setAttribute('ng-bind-html', title);
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

            // setup all waypoints
            setUpWaypoints();
        }
    };

    // sets up all waypoints
    function setUpWaypoints() {
        // get the starting offset
        var startOffset = $rootScope.$root.getWaypointStart();

        // initialize the waypoint list
        var waypointList = [
            { id: 'about-bio', offset: startOffset, class: 'animated fadeIn' }, 
            { id: 'about-hobbies', offset: startOffset, class: 'animated fadeIn' }, 
            { id: 'about-favorites', offset: startOffset, class: 'animated fadeIn' }
        ];

        // go through all waypoints
        _.forEach(waypointList, function(value) {
            // get the element
            var documentElement = document.getElementById(value.id);

            // see if element exists
            if(documentElement) {
                value.waypoint = new Waypoint({
                    element: documentElement,
                    handler: function(direction) {
                        // if direction is down
                        if(direction == 'down') {
                            // get the element
                            var ele = angular.element('#' + this.element.id);

                            // if the element exists
                            if(ele && ele['0']) {
                                ele.addClass(value.class);
                                ele['0'].style.visibility = 'visible';
                            }
                        }
                    },
                    offset: value.offset
                });
            }
        });
    };
}]);