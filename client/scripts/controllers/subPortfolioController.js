angular.module('app').controller('subPortfolioController', ['$scope', '$rootScope', '$compile', '$location', '$window', '$routeParams', '$sce', '$timeout', 'cfpLoadingBar', 'Service', function ($scope, $rootScope, $compile, $location, $window, $routeParams, $sce, $timeout, cfpLoadingBar, Service) {
    // determines if a page has already sent a request for load
    var pageRequested = false;

    // set jQuery
    $ = window.jQuery;

    // set the path
    Service.afterPath = $location.path();

    // get the parameters
    var subPortfolioId = $routeParams.subPortfolioId;

    // holds the error
    $scope.error = {
        "error": false,
        "title": "",
        "status": 404,
        "message": ""
    };

    // the current project highlight image
    $scope.currentProjectImage = undefined;

    // the current trailer video (url: the url, source: the trusted video source ($sce))
    $scope.currentTrailerVideo = {
        "url": undefined,
        "source": undefined   
    };

    // the current update video
    $scope.currentUpdateVideo = {
        "url": undefined,
        "source": undefined   
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

    // on loading http intercepter start
    $scope.start = function () {
        // start loader
        cfpLoadingBar.start();
    };

    // on loading http intercepter complete
    $scope.complete = function () {i
        // complete loader
        cfpLoadingBar.complete();
    };

    // determines if current image/video is active
    $scope.isActive = function (resource, index) {
        // if the resource matches
        if(resource == 'highlights' && index >= 0 && index < $scope.subPortfolio.images.length) {
            return $scope.currentProjectImage == $scope.subPortfolio.images[index].url;
        }
        else if(resource == 'updates' && index >= 0 && index < $scope.subPortfolio.videoUpdates.length) {
            return $scope.currentUpdateVideo.url == $scope.subPortfolio.videoUpdates[index].url;
        }

        return false;
    };

    // changes the current image displayed
    $scope.changeProjectHighlightImage = function (index) {
        // if the index matches
        if(index >= 0 && index < $scope.subPortfolio.images.length) {
            // change image
            $scope.currentProjectImage = $scope.subPortfolio.images[index].url;
        }
    };

    // changes the update video
    $scope.changeUpdateVideo = function (index) {
        // if the index matches
        if(index >= 0 && index < $scope.subPortfolio.videoUpdates.length) {
            // change video
            $scope.currentUpdateVideo.url = $scope.subPortfolio.videoUpdates[index].url;
            $scope.currentUpdateVideo.source = $sce.trustAsResourceUrl($scope.subPortfolio.videoUpdates[index].url);
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
            pageRequested = true;

            // get page data
            getPageData();
        }
    };
    
    // gets the page data
    function getPageData() {
        // get subportfolio page data
        Service.getSubPortfolioPageData(subPortfolioId).then(function (responseSP) {
            // if returned a valid response
            if (!responseSP.error) {
                // set the data
                $scope.subPortfolio = responseSP;
                $scope.gameDataColumnsPerRow = 6;
                $scope.gameDataMaxRowCountArray = new Array(Math.ceil($scope.subPortfolio.overviewContent.gameData.length / $scope.gameDataColumnsPerRow));
                $scope.gameDataColumnsPerRowArray = new Array($scope.gameDataColumnsPerRow);

                // determines if this page has these items
                var hasDownloads = false,
                    hasUpdates = false,
                    hasTrailer = false;

                // if the page has images
                if(responseSP.images.length > 0) {
                    // set initial video
                    $scope.currentProjectImage = responseSP.images[0].url;
                }

                // if the page has downloads
                if(responseSP.overviewContent.downloadLinks.length > 0) {
                    // show it has download links
                    hasDownloads = true;
                }

                // if the page has trailer videos
                if (responseSP.trailerLink.length > 0) {
                    // set the initial video path
                    $scope.currentTrailerVideo.url = responseSP.trailerLink;
                    $scope.currentTrailerVideo.source = $sce.trustAsResourceUrl(responseSP.trailerLink);

                    // show it has a trailer
                    hasTrailer = true;
                }

                // if the page has video updates
                if (responseSP.videoUpdates.length > 0) {
                    // set the initial video path
                    $scope.currentUpdateVideo.url = responseSP.videoUpdates[0].url;
                    $scope.currentUpdateVideo.source = $sce.trustAsResourceUrl(responseSP.videoUpdates[0].url);

                    // show it has updates
                    hasUpdates = true;
                }

                // holds the animation times
                $scope.subPortfolioAnimations = new Array(6);

                // the initial delayed start time of any animation
                var startTime = 1.5;

                // the incremental start time of every animation (every animation in the array has a value greater than the last by this much)
                var incrementTime = 1;

                // holds the positional value in which the last real delay value was set
                var previousActualX = 0;

                // loop through all animation timing and set the times
                for(var x = 0; x < $scope.subPortfolioAnimations.length; x++) {
                    
                    // if download links
                    if(hasDownloads && x == 3) {
                        $scope.subPortfolioAnimations[x] = {
                            'animation-delay': startTime + (previousActualX * incrementTime) + 's',
                            '-webkit-animation-delay': startTime + (previousActualX * incrementTime) + 's',
                            '-moz-animation-delay': startTime + (previousActualX * incrementTime) + 's'
                        };
                        previousActualX++;
                    }
                    // if trailer
                    else if(hasTrailer && x == 4) {
                        $scope.subPortfolioAnimations[x] = {
                            'animation-delay': startTime + (previousActualX * incrementTime) + 's',
                            '-webkit-animation-delay': startTime + (previousActualX * incrementTime) + 's',
                            '-moz-animation-delay': startTime + (previousActualX * incrementTime) + 's'
                        };
                        previousActualX++;
                    }
                    // if updates
                    else if(hasUpdates && x == 5) {
                        $scope.subPortfolioAnimations[x] = {
                            'animation-delay': startTime + (previousActualX * incrementTime) + 's',
                            '-webkit-animation-delay': startTime + (previousActualX * incrementTime) + 's',
                            '-moz-animation-delay': startTime + (previousActualX * incrementTime) + 's'
                        };
                        previousActualX++;
                    }
                    else if(x < 3) {
                        previousActualX++;
                        $scope.subPortfolioAnimations[x] = {
                            'animation-delay': startTime + (x * incrementTime) + 's',
                            '-webkit-animation-delay': startTime + (x * incrementTime) + 's',
                            '-moz-animation-delay': startTime + (x * incrementTime) + 's'
                        };
                    }
                }

                // set new page title
                $scope.pageTitle = responseSP.title + " | " + Service.appName;

                // setup page
                setUpPage();
            }
            else {
                // set error
                $scope.pageTitle = responseSP.title;
                $scope.error.error = true;
                $scope.error.title = responseSP.title;
                $scope.error.status = responseSP.status;
                $scope.error.message = responseSP.message;

                // setup page
                setUpPage();
            }
        })
        .catch(function (responseSP) {
            // set error
            $scope.pageTitle = responseSP.title;
            $scope.error.error = true;
            $scope.error.title = responseSP.title;
            $scope.error.status = responseSP.status;
            $scope.error.message = responseSP.message;

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