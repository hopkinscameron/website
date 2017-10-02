'use strict'

// set up the module
var portfolioModule = angular.module('portfolio');

// create the controller
portfolioModule.controller('PortfolioItemController', ['$scope', '$rootScope', '$compile', '$location', '$window', '$routeParams', '$sce', '$timeout', 'Service', 'PortfolioFactory', function ($scope, $rootScope, $compile, $location, $window, $routeParams, $sce, $timeout, Service, PortfolioFactory) {
    // determines if a page has already sent a request for load
    var pageRequested = false;

    // set jQuery
    $ = window.jQuery;

    // set the path
    Service.afterPath = $location.path();

    // get the parameters
    var portfolioItemId = $routeParams.portfolioItemId;

    // holds the error
    $scope.error = {
        'error': false,
        'title': '',
        'status': 404,
        'message': ''
    };

    // the current project highlight image
    $scope.currentProjectImage = undefined;

    // the current trailer video (url: the url, source: the trusted video source ($sce))
    $scope.currentTrailerVideo = {
        'url': undefined,
        'source': undefined   
    };

    // the current update video
    $scope.currentUpdateVideo = {
        'url': undefined,
        'source': undefined   
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

    // determines if current image/video is active
    $scope.isActive = function (resource, index) {
        // if the resource matches
        if(resource == 'highlights' && index >= 0 && index < $scope.portfolioItem.images.length) {
            return $scope.currentProjectImage == $scope.portfolioItem.images[index].url;
        }
        else if(resource == 'updates' && index >= 0 && index < $scope.portfolioItem.videoUpdates.length) {
            return $scope.currentUpdateVideo.url == $scope.portfolioItem.videoUpdates[index].url;
        }

        return false;
    };

    // checks to see if index is the last 'row' for images
    $scope.isLastRowOfImages = function (index) {
        // images array length
        var len = $scope.portfolioItem.images.length;

        // if the index matches
        if(index >= 0 && index < len) {
            // if even amount of images
            if(len % 2 == 0 && index >= len - 2) {
                return true;
            }
            else if(len % 2 == 1 && index >= len - 1) {
                return true;
            }
        }

        return false;
    };

    // checks to see if index is the last image
    $scope.isLastRowOfImages = function (index) {
        // images array length
        var len = $scope.portfolioItem.images.length;

        // if the index matches
        if(index >= 0 && index < len) {
            // if even amount of images
            if(len % 2 == 0 && index >= len - 2) {
                return true;
            }
            else if(len % 2 == 1 && index >= len - 1) {
                return true;
            }
        }

        return false;
    };

    // changes the current image displayed
    $scope.changeProjectHighlightImage = function (index) {
        // if the index matches
        if(index >= 0 && index < $scope.portfolioItem.images.length) {
            // change image
            $scope.currentProjectImage = $scope.portfolioItem.images[index].url;
        }
    };

    // changes the update video
    $scope.changeUpdateVideo = function (index) {
        // if the index matches
        if(index >= 0 && index < $scope.portfolioItem.videoUpdates.length) {
            // change video
            $scope.currentUpdateVideo.url = $scope.portfolioItem.videoUpdates[index].url;
            $scope.currentUpdateVideo.source = $sce.trustAsResourceUrl($scope.portfolioItem.videoUpdates[index].url);
        }
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
            // set page has been requested
            pageRequested = true;

            // show the page after a timeout
            $timeout(getPageData, $rootScope.$root.getPageDataTimeout);
        }
    };
    
    // gets the page data
    function getPageData() {
        // get portfolio item page data
        PortfolioFactory.getPortfolioItemPageInformation(portfolioItemId).then(function (responsePI) {
            // if returned a valid response
            if (!responsePI.error) {
                // set the data
                $scope.portfolioItem = responsePI;
                $scope.gameDataColumnsPerRow = 6;
                $scope.gameDataMaxRowCountArray = new Array(Math.ceil($scope.portfolioItem.overviewContent.gameData.length / $scope.gameDataColumnsPerRow));
                $scope.gameDataColumnsPerRowArray = new Array($scope.gameDataColumnsPerRow);

                // if there more columns than necessary
                if($scope.gameDataColumnsPerRowArray.length > $scope.gameDataColumnsPerRow) {
                    $scope.gameDataColumnsPerRowArray = new Array($scope.gameDataColumnsPerRow);
                }

                // determines if this page has these items
                var hasDownloads = false,
                    hasUpdates = false,
                    hasTrailer = false;

                // if the page has images
                if(responsePI.images.length > 0) {
                    // set initial video
                    $scope.currentProjectImage = responsePI.images[0].url;
                }

                // if the page has downloads
                if(responsePI.overviewContent.downloadLinks.length > 0) {
                    // show it has download links
                    hasDownloads = true;
                }

                // if the page has trailer videos
                if (responsePI.trailerLink.length > 0) {
                    // set the initial video path
                    $scope.currentTrailerVideo.url = responsePI.trailerLink;
                    $scope.currentTrailerVideo.source = $sce.trustAsResourceUrl(responsePI.trailerLink);

                    // show it has a trailer
                    hasTrailer = true;
                }

                // if the page has video updates
                if (responsePI.videoUpdates.length > 0) {
                    // set the initial video path
                    $scope.currentUpdateVideo.url = responsePI.videoUpdates[0].url;
                    $scope.currentUpdateVideo.source = $sce.trustAsResourceUrl(responsePI.videoUpdates[0].url);

                    // show it has updates
                    hasUpdates = true;
                }

                // holds the animation time
                $scope.animationStyle = $rootScope.$root.getAnimationDelay();

                // set new page title
                $scope.pageTitle = responsePI.title + ' | ' + ApplicationConfiguration.applicationName;

                // setup page
                setUpPage();
            }
            else {
                // set error
                $scope.pageTitle = responsePI.title;
                $scope.error.error = true;
                $scope.error.title = responsePI.title;
                $scope.error.status = responsePI.status;
                $scope.error.message = responsePI.message;

                // setup page
                setUpPage();
            }
        })
        .catch(function (responsePI) {
            // set error
            $scope.pageTitle = responsePI.title;
            $scope.error.error = true;
            $scope.error.title = responsePI.title;
            $scope.error.status = responsePI.status;
            $scope.error.message = responsePI.message;

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
            { id: 'portfolio-item-highlights', offset: startOffset, class: 'animated fadeIn' }, 
            { id: 'portfolio-item-overview', offset: startOffset, class: 'animated fadeIn' }, 
            { id: 'portfolio-item-details', offset: startOffset, class: 'animated fadeIn' }, 
            { id: 'portfolio-item-downloads', offset: startOffset, class: 'animated fadeIn' }, 
            { id: 'portfolio-item-trailer', offset: startOffset, class: 'animated fadeIn' }, 
            { id: 'portfolio-item-updates', offset: startOffset, class: 'animated fadeIn' }
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