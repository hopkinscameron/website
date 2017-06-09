angular.module('app').controller('subPortfolioController', ['$scope', '$rootScope', '$compile', '$location', 'cfpLoadingBar', '$routeParams', '$window', '$sce', 'Service', function ($scope, $rootScope, $compile, $location, cfpLoadingBar, $routeParams, $window, $sce, Service) {
    // set jQuery
    $ = window.jQuery;

    // set the path
    Service.afterPath = $location.path();

    // holds the page title
    $scope.pageTitle = Service.appName;

    // get the parameters
    var subPortfolioID = $routeParams.subPortfolioID;

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

    // get page data
    getPageData();

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

    // gets the page data
    function getPageData() {
        // get subportfolio page data
        Service.getSubPortfolioPageData(subPortfolioID).then(function (responseSP) {
            // if returned a valid response
            if (!responseSP.error) {
                // set the data
                $scope.subPortfolio = responseSP;

                // set new page title
                $scope.pageTitle = responseSP.title + " | " + Service.appName;

                // if the file has images
                if(responseSP.images.length > 0) {
                    // set initial video
                    $scope.currentProjectImage = responseSP.images[0].url;
                }

                // if the file has video updates
                if (responseSP.videoUpdates.length > 0) {
                    // set the initial video path
                    $scope.currentUpdateVideo.url = responseSP.videoUpdates[0].url;
                    $scope.currentUpdateVideo.source = $sce.trustAsResourceUrl(responseSP.videoUpdates[0].url);
                }

                // if the file has trailer videos
                if (responseSP.trailerLink.length > 0) {
                    // set the initial video path
                    $scope.currentTrailerVideo.url = responseSP.trailerLink;
                    $scope.currentTrailerVideo.source = $sce.trustAsResourceUrl(responseSP.trailerLink);
                }

                // setup page
                setUpPage();
            }
            else {
                // set error
                $scope.pageTitle = responseSP.message;

                // set error
                $scope.error.error = true;
                $scope.error.message = responseSP.message;

                // setup page
                setUpPage();
            }
        })
        .catch(function (responseSP) {
            // set error
            $scope.pageTitle = responseSP.message;

            // set error
            $scope.error.error = true;
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
    };

    // normalize all carousel images
    function carouselNormalization() {
        var items = $('#slide-show-carousel .carousel-inner .item'), //grab all slides
            heights = [], //create empty array to store height values
            tallest; //create variable to make note of the tallest slide

        if (items.length) {
            function normalizeHeights() {
                items.each(function () { //add heights to array
                    heights.push($(this).height());
                });
                tallest = Math.max.apply(null, heights); //cache largest value
                items.each(function () {
                    $(this).css('min-height', tallest + 'px');
                });
            };
            normalizeHeights();

            $(window).on('resize orientationchange', function () {
                tallest = 0, heights.length = 0; //reset vars
                items.each(function () {
                    $(this).css('min-height', '0'); //reset min-height
                });
                normalizeHeights(); //run it again 
            });
        }
    };
}]);