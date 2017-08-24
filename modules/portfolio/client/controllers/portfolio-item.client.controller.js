﻿'use strict'

// set up the module
var portfolioModule = angular.module('portfolio');

// create the controller
portfolioModule.controller('PortfolioItemController', ['$scope', '$rootScope', '$compile', '$location', '$window', '$routeParams', '$sce', '$timeout', 'ngDialog', 'Service', 'PortfolioFactory', function ($scope, $rootScope, $compile, $location, $window, $routeParams, $sce, $timeout, ngDialog, Service, PortfolioFactory) {
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

    // show loading dialog
    var loadingDialog = ngDialog.open({
        template: '/modules/dialog/client/views/dialog-loading.client.view.html',
        controller: 'DialogLoadingController',
        className: 'ngdialog-theme-default ngdialog-theme-dark custom-width',
        showClose: false,
        closeByEscape: false,
        closeByDocument: false,
        data: undefined
    });

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

                // holds the animation times
                $scope.portfolioItemAnimations = new Array(6);

                // the initial delayed start time of any animation
                var startTime = 1.5;

                // the incremental start time of every animation (every animation in the array has a value greater than the last by this much)
                var incrementTime = 1;

                // holds the positional value in which the last real delay value was set
                var previousActualX = 0;

                // loop through all animation timing and set the times
                for(var x = 0; x < $scope.portfolioItemAnimations.length; x++) {
                    // if download links
                    if(hasDownloads && x == 3) {
                        $scope.portfolioItemAnimations[x] = {
                            'animation-delay': startTime + (previousActualX * incrementTime) + 's',
                            '-webkit-animation-delay': startTime + (previousActualX * incrementTime) + 's',
                            '-moz-animation-delay': startTime + (previousActualX * incrementTime) + 's'
                        };
                        previousActualX++;
                    }
                    // if trailer
                    else if(hasTrailer && x == 4) {
                        $scope.portfolioItemAnimations[x] = {
                            'animation-delay': startTime + (previousActualX * incrementTime) + 's',
                            '-webkit-animation-delay': startTime + (previousActualX * incrementTime) + 's',
                            '-moz-animation-delay': startTime + (previousActualX * incrementTime) + 's'
                        };
                        previousActualX++;
                    }
                    // if updates
                    else if(hasUpdates && x == 5) {
                        $scope.portfolioItemAnimations[x] = {
                            'animation-delay': startTime + (previousActualX * incrementTime) + 's',
                            '-webkit-animation-delay': startTime + (previousActualX * incrementTime) + 's',
                            '-moz-animation-delay': startTime + (previousActualX * incrementTime) + 's'
                        };
                        previousActualX++;
                    }
                    else if(x < 3) {
                        previousActualX++;
                        $scope.portfolioItemAnimations[x] = {
                            'animation-delay': startTime + (x * incrementTime) + 's',
                            '-webkit-animation-delay': startTime + (x * incrementTime) + 's',
                            '-moz-animation-delay': startTime + (x * incrementTime) + 's'
                        };
                    }
                }

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

        // close the loading dialog
        loadingDialog.close();
        
        // on completion of close
        loadingDialog.closePromise.then(function (data) {
            // set page fully loaded
            $scope.pageFullyLoaded = true;

            // show the page after a timeout
            $timeout(showPage, $rootScope.$root.showPageTimeout);
        });
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