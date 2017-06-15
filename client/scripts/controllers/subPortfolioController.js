angular.module('app').controller('subPortfolioController', ['$scope', '$rootScope', '$compile', '$location', 'cfpLoadingBar', '$routeParams', '$window', '$sce', 'Service', function ($scope, $rootScope, $compile, $location, cfpLoadingBar, $routeParams, $window, $sce, Service) {
    // set jQuery
    $ = window.jQuery;

    // set the path
    Service.afterPath = $location.path();

    // get the parameters
    var subPortfolioID = $routeParams.subPortfolioID;

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

        // get page data
        getPageData();
    };
    
    // gets the page data
    function getPageData() {
        // get subportfolio page data
        Service.getSubPortfolioPageData(subPortfolioID).then(function (responseSP) {
            // if returned a valid response
            if (!responseSP.error) {
                // set the data
                $scope.subPortfolio = responseSP;
                $scope.gameDataColumnsPerRow = 6;
                $scope.gameDataMaxRowCountArray = new Array(Math.ceil($scope.subPortfolio.overviewContent.gameData.length / $scope.gameDataColumnsPerRow));
                $scope.gameDataColumnsPerRowArray = new Array($scope.gameDataColumnsPerRow);

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
    };
}]);