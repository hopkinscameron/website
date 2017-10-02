'use strict'

// set up the module
var portfolioModule = angular.module('portfolio');

// create the controller
portfolioModule.controller('PortfolioListController', ['$scope', '$rootScope', '$compile', '$location', '$timeout', 'Service', 'PortfolioFactory', function ($scope, $rootScope, $compile, $location, $timeout, Service, PortfolioFactory) {
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

    // set current path
    $scope.currentPath = $location.path();

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
    
    // gets the title of the picture
    $scope.getPictureTitle = function (pictureLink) {
        //split string
        var splits = pictureLink.split('/');
        return splits[splits.length - 1];
    };

    // go to subpage link
    $scope.goToSubPageLink = function (subPageLink) {
        var path = $location.path + '/' + subPageLink;
        $location.path($location.path + '/' + subPageLink);
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
            // set page has been requested
            pageRequested = true;

            // show the page after a timeout
            $timeout(getPageData, $rootScope.$root.getPageDataTimeout);
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

                // holds the animation time
                $scope.animationStyle = $rootScope.$root.getAnimationDelay();

                // holds the page title
                $scope.pageTitle = 'Portfolio | ' + ApplicationConfiguration.applicationName;

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
        var waypointList = [];

        // the index of the item
        var index = 0;

        // go through each item
        _.forEach($scope.portfolio.portfolioItems, function(value) {
            // set the class based on index/device
            var c = index % 2 == 0 ? 'animated zoomInLeft' : 'animated zoomInRight';
            c = $rootScope.$root.isDeviceWidthSmallerThan(768) ? 'animated zoomInUp' : c;
            var tmpWP = { id: 'porfolioId' + index, offset: startOffset, class: c };
            waypointList.push(tmpWP);
            index++;
        });

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