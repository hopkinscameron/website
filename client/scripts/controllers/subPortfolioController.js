angular.module('app').controller('subPortfolioController', ['$scope', '$rootScope', '$compile', '$location', 'cfpLoadingBar', '$routeParams', '$window', '$sce', 'Service', function ($scope, $rootScope, $compile, $location, cfpLoadingBar, $routeParams, $window, $sce, Service) {
    // set jQuery
    $ = window.jQuery;

    // set the path
    Service.afterPath = $location.path();

    // holds the page title
    $scope.pageTitle = Service.appName; //" | " + Service.appName;

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

    // the current index of the array of images
    var currentIndex = 0;

    // the switch image timing
    var imageSwitchTimer = 3000;
    var initialPicturePath = "/media/portfolio-images/";
    var jsonFilePath = "/data/";

    // start fading animation
    // wait a certain amount of seconds then call switchImage
    var timeoutHandle = $window.setTimeout(switchImage, imageSwitchTimer);

    // the initial update video link
    var initialUpdateVideo = "";

    // the initial trailer video link
    var initialTrailerVideo = "";

    // get page data
    getPageData();

    // shift children based on multidata
    $('.carousel[data-type="multi"] .item').each(function () {
        var next = $(this).next();
        if (!next.length) {
            next = $(this).siblings(':first');
        }
        next.children(':first-child').clone().appendTo($(this));

        for (var i = 0; i < 4; i++) {
            next = next.next();
            if (!next.length) {
                next = $(this).siblings(':first');
            }

            next.children(':first-child').clone().appendTo($(this));
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

    // gets the game design document title
    $scope.getDesignDocumentTitle = function (designDocumentLink) {
        //split string
        var splits = designDocumentLink.split('/');
        return splits[splits.length - 1];
    };

    // changes the current image displayed
    $scope.changeImage = function (imageSource, index) {
        // get the componenets broken up
        var splits = imageSource.split('/');

        // set the current index
        currentIndex = index;

        // the image to change, display the image and change the source
        var imageToChange = document.getElementById("slide-show-image-main");
        if (imageToChange != null) {
            imageToChange.style.display = "block";
            imageToChange.src = imageSource;
            imageToChange.title = splits[splits.length - 1];
            imageToChange.alt = splits[splits.length - 1];
        }

        // get the subimages 
        var subImages = document.getElementsByClassName("slideshow-subimages-to-switch");

        // loop through all subimages
        for (i = 0; i < subImages.length; i++) {
            // remove the selected image
            subImages[i].className = subImages[i].className.replace(" slideshow-subimage-selected", "");
        }

        // if there were elements found
        if (subImages.length > 0) {
            // set the selected image
            subImages[index].className += " slideshow-subimage-selected";
        }

        // clear the timeout and reset
        $window.clearTimeout(timeoutHandle);
        timeoutHandle = $window.setTimeout(switchImage, imageSwitchTimer);
    };

    // changes the update video
    $scope.changeUpdateVideo = function (videoSource, index) {
        // the video to change, change the source
        var videoToChange = document.getElementById("subPortfolio-update-video-iframe");
        if (videoToChange) {
            videoToChange.src = videoSource;
        }

        // get the subimages 
        var subImages = document.getElementsByClassName("slideshow-subvideoimage-to-switch");

        // if the images exist
        if (subImages.length > 0) {
            // loop through all subimages
            for (i = 0; i < subImages.length; i++) {
                // remove the selected image
                subImages[i].className = subImages[i].className.replace(" slideshow-subvideoimage-selected", "");
            }

            // set the selected image
            subImages[index].className += " slideshow-subvideoimage-selected";
        }
    };

    // initializes this specific controller
    $scope.initializeController = function () {
        // once the script starts, set the initial picture
        $scope.changeImage(initialPicturePath, currentIndex);

        // if there is an initial update video
        if (initialUpdateVideo.length > 0) {
            // once the script starts, set the initial video
            $scope.changeUpdateVideo(initialUpdateVideo, 0);
        }

        // if there is an initial trailer video
        if (initialTrailerVideo.length > 0) {
            // once the script starts, set the initial video
            var videoToChange = document.getElementById("subPortfolio-trailer-iframe");

            // if the element was found
            if (videoToChange) {
                // set the source
                videoToChange.src = initialTrailerVideo;
            }
        }
    };

    // gets the starting update video
    $scope.getStartingUpdateVideo = function () {
        return $sce.trustAsResourceUrl(initialUpdateVideo);
    };

    // gets the starting trailer video
    $scope.getStartingTrailerVideo = function () {
        return $sce.trustAsResourceUrl(initialTrailerVideo);
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

                // if the file has video updates
                if (responseSP.videoUpdates.length > 0) {
                    // set the initial video path
                    initialUpdateVideo = responseSP.videoUpdates[0].videoLink;
                    $scope.startingUpdateVideo = $sce.trustAsResourceUrl(initialUpdateVideo);
                }

                // if the file has trailer videos
                if (responseSP.trailerLink.length > 0) {
                    // set the initial trailer video path
                    initialTrailerVideo = responseSP.trailerLink;
                    $scope.trailerVideo = $sce.trustAsResourceUrl(initialTrailerVideo);
                }

                // initialize
                $scope.initializeController();

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

    // function that switches to the next image
    function switchImage() {
        // get the sub images 
        var subImages = document.getElementsByClassName("slideshow-subimages-to-switch");
        subImages = [];
        // if there are sub images
        if (subImages.length > 0) {
            // increase the index
            currentIndex = (currentIndex + 1) % subImages.length;

            // get the componenets broken up
            var splits = subImages[currentIndex].src.split('/');

            // the image to change, display the image and change the source
            var imageToChange = document.getElementById("slide-show-image-main");
            imageToChange.style.display = "block";
            imageToChange.src = subImages[currentIndex].src;
            imageToChange.title = splits[splits.length - 1];
            imageToChange.alt = splits[splits.length - 1];

            // loop through all subimages
            for (i = 0; i < subImages.length; i++) {
                // remove the selected image
                subImages[i].className = subImages[i].className.replace(" slideshow-subimage-selected", "");
            }

            // set the selected image
            subImages[currentIndex].className += " slideshow-subimage-selected";
        }

        // wait a certain amount of seconds then call switchImage
        $window.clearTimeout(timeoutHandle);
        timeoutHandle = $window.setTimeout(switchImage, imageSwitchTimer);
    };
}]);