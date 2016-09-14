var app = angular.module("app", []).filter('trustUrl', function ($sce) {
    return function (url) {
        return $sce.trustAsResourceUrl(url);
    };
}).filter('trustHTML', function ($sce) {
    return function (html) {
        return $sce.trustAsHtml(html);
    };
});

/*
// configure using app router
app.config(function ($routeProvider) {
    $routeProvider
		.when('/resume', {
		    templateUrl: 'resume.html',
		    controller: 'resumeController'
		})
})
*/

// the Header Controller
app.controller('headerController', function ($scope, $http) {
    $http.get('/external-files/data/header.json').success(function (data) {
        $scope.header = data;
    });
});

// the Footer Controller
app.controller('footerController', function ($scope, $http) {
    $http.get('/external-files/data/footer.json').success(function (data) {
        $scope.footer = data;
    });
});

// the Home controller
app.controller('homeController', function ($scope, $http) {
    $http.get('/external-files/data/home.json').success(function (data) {
        $scope.home = data;
    });
});

// the About Me controller
app.controller('aboutMeController', function ($scope, $http) {
    $http.get('/external-files/data/about-me.json').success(function (data) {
        $scope.aboutme = data;
    });
});

// the Resume controller
app.controller('resumeController', function ($scope, $http) {
    $http.get('/external-files/data/resume.json').success(function (data) {
        $scope.resume = data;
    });
});

// the Portfolio controller
app.controller('portfolioController', function ($scope, $http) {
    $http.get('/external-files/data/portfolio.json').success(function (data) {
        $scope.portfolio = data;
    });
    $scope.getPictureTitle = function (pictureLink) {
        //split string
        var splits = pictureLink.split('/');
        return splits[splits.length - 1];
    };
});

// the Sub Portfolio controller
app.controller('subPortfolioController', function ($scope, $http, $filter, $sce, $window) {

    // script that will change the image during a slide show 

    // the current index of the array of images
    var currentIndex = 0;

    // the switch image timing
    var imageSwitchTimer = 3000;
    var splits = window.location.href.split('/');
    var initialPicturePath = "/external-files/media/portfolio-images/";
    var jsonFilePath = "/external-files/data/";

    // start fading animation
    // wait a certain amount of seconds then call fadeImage
    var timeoutHandle = window.setTimeout(fadeImage, imageSwitchTimer);

    // based on which page is currently loaded, set that picture path
    if (splits[splits.length - 2].includes("drive-on-metz")) {
        initialPicturePath += "driveonmetz/driveonmetz-logo.jpg";
        jsonFilePath += "drive-on-metz.json";
    }
    else if (splits[splits.length - 2].includes("forsaken")) {
        initialPicturePath += "forsaken/forsaken-logo.png";
        jsonFilePath += "forsaken.json";
    }
    else if (splits[splits.length - 2].includes("memoryless")) {
        initialPicturePath += "memoryless/memoryless-logo.jpg";
        jsonFilePath += "memoryless.json";
    }
    else if (splits[splits.length - 2].includes("over-drive")) {
        initialPicturePath += "overdrive/overdrive-logo.png";
        jsonFilePath += "over-drive.json";
    }
    else if (splits[splits.length - 2].includes("road-rager")) {
        initialPicturePath += "roadrager/roadrager-logo.png";
        jsonFilePath += "road-rager.json";
    }
    else if (splits[splits.length - 2].includes("rollaball-mod")) {
        initialPicturePath += "rollaballmod/rollaballmod-logo.png";
        jsonFilePath += "rollaball-mod.json";
    }
    else if (splits[splits.length - 2].includes("squirvival")) {
        initialPicturePath += "squirvival/squirvival-logo.png";
        jsonFilePath += "squirvival.json";
    }

    // the initial update video link
    var initialUpdateVideo = "";

    // the initial trailer video link
    var initialTrailerVideo = "";


    $http.get(jsonFilePath).success(function (data) {
        $scope.subPortfolio = data;
        if (data.videoUpdates.length > 0) {
            initialUpdateVideo = data.videoUpdates[0].videoLink;
            $scope.startingUpdateVideo = $sce.trustAsResourceUrl(initialUpdateVideo);
        }

        if (data.trailerLink.length > 0) {
            initialTrailerVideo = data.trailerLink;
            $scope.trailerVideo = $sce.trustAsResourceUrl(initialTrailerVideo);
        }
    });

    $scope.dataAsHTML = function (htmlData) {
        return $sce.trustAsHtml("<i>Hello</i> <b>World!</b>");
    };

    $scope.getDesignDocumentTitle = function (designDocumentLink) {
        //split string
        var splits = designDocumentLink.split('/');
        return splits[splits.length - 1];
    };

    $scope.changeImage = function (imageSource, index) {
        // get the componenets broken up
        var splits = imageSource.split('/');

        // set the current index
        currentIndex = index;

        // the loading image that was displayed, remove the display
        var loadingImage = document.getElementsByClassName("image-loading");
        loadingImage[0].style.display = "none";

        // the image to change, display the image and change the source
        var imageToChange = document.getElementsByClassName("slideshow-image");
        imageToChange[0].style.display = "block";
        imageToChange[0].src = imageSource;
        imageToChange[0].title = splits[splits.length - 1];
        imageToChange[0].alt = splits[splits.length - 1];

        // get the subimages 
        var subImages = document.getElementsByClassName("slideshow-subimages-to-switch");

        // loop through all subimages
        for (i = 0; i < subImages.length; i++) {
            // remove the selected image
            subImages[i].className = subImages[i].className.replace(" slideshow-subimage-selected", "");
        }

        // set the selected image
        subImages[index].className += " slideshow-subimage-selected";

        // clear the timeout and reset
        $window.clearTimeout(timeoutHandle);
        timeoutHandle = $window.setTimeout(fadeImage, imageSwitchTimer);
    };

    $scope.changeUpdateVideo = function (videoSource, index) {
        // the video to change, change the source
        var videoToChange = document.getElementsByClassName("iframe-porfolio-update-video");
        videoToChange[0].src = videoSource;

        // get the subimages 
        var subImages = document.getElementsByClassName("slideshow-subvideoimage-to-switch");

        // loop through all subimages
        for (i = 0; i < subImages.length; i++) {
            // remove the selected image
            subImages[i].className = subImages[i].className.replace(" slideshow-subvideoimage-selected", "");
        }

        // set the selected image
        subImages[index].className += " slideshow-subvideoimage-selected";
    };

    $window.onload = function (e) {
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
            var videoToChange = document.getElementsByClassName("iframe-porfolio-trailer-video");
            videoToChange[0].src = initialTrailerVideo;
        }
    }

    // function that fades to the next image
    function fadeImage() {
        // get the sub images 
        var subImages = document.getElementsByClassName("slideshow-subimages-to-switch");

        // increase the index
        currentIndex = (currentIndex + 1) % subImages.length;

        // get the componenets broken up
        var splits = subImages[currentIndex].src.split('/');

        // the image to change, display the image and change the source
        var imageToChange = document.getElementsByClassName("slideshow-image");
        imageToChange[0].style.display = "block";
        imageToChange[0].src = subImages[currentIndex].src;
        imageToChange[0].title = splits[splits.length - 1];
        imageToChange[0].alt = splits[splits.length - 1];

        // loop through all subimages
        for (i = 0; i < subImages.length; i++) {
            // remove the selected image
            subImages[i].className = subImages[i].className.replace(" slideshow-subimage-selected", "");
        }

        // set the selected image
        subImages[currentIndex].className += " slideshow-subimage-selected";

        // wait a certain amount of seconds then call fadeImage
        $window.clearTimeout(timeoutHandle);
        timeoutHandle = $window.setTimeout(fadeImage, imageSwitchTimer);
    }
});

// the Contact controller
app.controller('contactController', function ($scope, $http) {
    $http.get('/external-files/data/contact.json').success(function (data) {
        $scope.contact = data;
    });
});