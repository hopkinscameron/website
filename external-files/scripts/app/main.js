
// determines if the header/footer is currently displaying
var headerDisplayed = false;
var footerDisplayed = false;

// the current page title
var currentPageTitle = "Cameron Hopkins";

// the background page link
var normalBackgroundPageLink = "/external-files/media/background-images/black-concrete.jpg";
var homeBackgroundPageLink = "/external-files/media/personal-images/sitting-professional.jpg";

// set up the application
var app = angular.module("app", ['ngRoute', 'ngSanitize']).filter('trustUrl', function ($sce) {
    return function (url) {
        return $sce.trustAsResourceUrl(url);
    };
}).filter('trustHTML', function ($sce) {
    return function (html) {
        return $sce.trustAsHtml(html);
    };
});

// configure using app router
app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider, $routeParams) {

    // remove index.html
    $locationProvider.hashPrefix();

    $routeProvider
        .when('/', {
            templateUrl: '/partials/home.html',
            controller: 'homeController'
        })
        .when('/about', {
            templateUrl: '/partials/about.html',
            controller: 'aboutMeController'
        })
        .when('/resume', {
            templateUrl: '/partials/resume.html',
            controller: 'resumeController'
        })
        .when('/portfolio', {
            templateUrl: '/partials/portfolio.html',
            controller: 'portfolioController'
        })
        .when('/portfolio/:subPortfolioID', {
            templateUrl: function () {
                if (isCorrectSubUrl(window.location.hash)) {
                    return '/partials/sub-portfolio.html';
                }
                else {
                    return '/partials/error.html';
                }
            },
            controller: function () {
                if (isCorrectSubUrl(window.location.hash)) {
                    return 'subPortfolioController';
                }
                else {
                    return 'errorController';
                }
            }
        })
        .when('/blog', {
            templateUrl: '/partials/blog.html',
            controller: 'blogController'
        })
        .when('/contact', {
            templateUrl: '/partials/contact.html',
            controller: 'contactController'
        })
        .otherwise({
            templateUrl: '/partials/error.html',
            controller: 'errorController'
        })

    //check browser support
    if (window.history && window.history.pushState) {

        // if you don't wish to set base URL then use this
        /*
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: true
        });*/
    }
}]);

// creates a directive for loading a spinner in place of an image
app.directive('spinnerLoad', [function spinnerLoad() {
    return {
        restrict: 'A',
        link: function spinnerLoadLink(scope, elem, attrs) {
            scope.$watch('ngSrc', function watchNgSrc() {
                elem.hide();
                elem.after('<i class="fa fa-spinner fa-lg fa-spin"></i>');  // add spinner
            });
            elem.on('load', function onLoad() {
                elem.show();
                elem.next('i.fa-spinner').remove(); // remove spinner
            });
        }
    };
}]);

// the Error Controller
app.controller('errorController', function ($scope, $http, $location, $window, $compile) {

    // hide the header if displayed     
    if (headerDisplayed) {
        hideHeader();
    }

    // display the footer
    displayFooter();

    // hide the home body display
    hideBodyHomeID()

    // get the data from the JSON file
    $http.get('/external-files/data/error.json').success(function (data) {
        $scope.error = data;
        var titleDOM = document.getElementById("pageTitle");
        var title = "\'" + "404" + "" + "\'";
        titleDOM.setAttribute("ng-bind-html", title);
        $compile(titleDOM)($scope);
    });

    // change the body id
    var body = document.getElementById("body-home");

    // if the id wasn't already changed
    if (body != null) {
        body.id = "bodyPlaceHolder";
        body.style = "background-color: #29a8d6;"
    }
    else {
        body = document.getElementById("bodyPlaceHolder");
        body.style = "background-color: #29a8d6;"
    }
});

// the Header Controller
app.controller('headerController', function ($scope, $http, $location, $window) {

    // the 768 media query
    var mq = window.matchMedia("(max-width: 767px)");

    // media query event handler
    if (matchMedia) {
        mq.addListener(WidthChange);
        WidthChange(mq);
    }

    // get the data from the JSON file
    $http.get('/external-files/data/header.json').success(function (data) {
        $scope.header = data;
    });

    // checks if the page is active
    $scope.isActive = function(page) {
        var windowSplit = $window.location.href.split('/');
        var pageSplit = page.split('/');
        if (windowSplit[windowSplit.length - 1] == pageSplit[pageSplit.length - 1])
        {
            // set the class as active
            return "active";
        }

        return "";
    }

    // checks if the page has a drop down menu
    $scope.checkIfDropdown = function (subNavigation, index, length) {

        // holds the value of the classes
        var dropDown = "";

        // if the sub navigation is not null, this is a drop down
        if (subNavigation != null && subNavigation.length > 0) {
            // set the class to 'dropdown'
            dropDown = "nav-dropdown";
        }

        // if this is the first element in the navigation
        if (index == 0)
        {
            // if this has data already
            if(dropDown.length > 0)
            {
                //dropDown += " bottom-left-corner-round";
            }
            else
            {
                //dropDown += "bottom-left-corner-round";
            }
        }
        // if this is the last index
        else if(index == length - 1)
        {
            // if this has data already
            if (dropDown.length > 0) {
                //dropDown += " bottom-right-corner-round";
            }
            else {
                //dropDown += "bottom-right-corner-round";
            }
        }

        // return the class list
        return dropDown;
    };

    // toggles the side menu
    $scope.toggleSideMenu = function () {

        // side menu currently active
        if (document.body.className == "active")
        {
            // remove class
            document.body.className = "";
        }
        else
        {
            // add class
            document.body.className = "active";          
        }
    }

    // toggles the overlay menu
    $scope.toggleOverlayMenu = function () {

        // get the overlay nav
        var navOverlay = document.getElementById("overlay-nav");

        // side menu currently active
        if (navOverlay.className == "open") {
            // remove class
            navOverlay.className = "closed";

            // get the img and switch the image
            var navLinkIcon = document.getElementById("nav-icon-link");

            // if the icon has been found
            if (navLinkIcon) {
                navLinkIcon.src = "/external-files/media/icons/menu.png";
            }
        }
        else {
            // add class
            navOverlay.className = "open";

            // get the img and switch the image
            var navLinkIcon = document.getElementById("nav-icon-link");

            // if the icon has been found
            if (navLinkIcon) {
                navLinkIcon.src = "/external-files/media/icons/cancel.png";
            }
        }
    }

    // media query change
    function WidthChange(mq) {
        if (mq.matches) {
            // window width is at least 767px
        } else {
            // window width is less than 767px

            // get the overlay nav
            var navOverlay = document.getElementById("overlay-nav");

            // remove class
            navOverlay.className = "closed";
        }
    }

    $scope.goHome = function (newPath) {
        // go home
        $location.path(newPath)
    }
});

// the Footer Controller
app.controller('footerController', function ($scope, $http) {

    // get the data from the JSON file
    $http.get('/external-files/data/footer.json').success(function (data) {
        $scope.footer = data;
    });
});

// the Home controller
app.controller('homeController', function ($scope, $http, $compile) {

    // hide the header if displayed     
    if (headerDisplayed) {
        hideHeader();
    }

    // hide the footer if displayed
    if (footerDisplayed) {
        hideFooter();
    }

    // show the home body display
    showBodyHomeID()

    // get the data from the JSON file
    $http.get('/external-files/data/home.json').success(function (data) {
        $scope.home = data;
        var titleDOM = document.getElementById("pageTitle");
        var title = "\'" + $scope.home.title + "\'";
        titleDOM.setAttribute("ng-bind-html", title);
        $compile(titleDOM)($scope);
        insertMetaData();
    });

    // insert the meta data
    function insertMetaData() {
        // create meta tags
        var description = document.createElement("meta");
        description.name = "description";
        description.content = $scope.home.metaTags.description;
        var keywords = document.createElement("meta");
        keywords.name = "keywords";
        keywords.content = "";

        // loop through all keywords
        for (x = 0; x < $scope.home.metaTags.keywords.length; x++) {
            // if this is the last element, don't add a comma
            if (x == $scope.home.metaTags.keywords.length - 1) {
                keywords.content += $scope.home.metaTags.keywords[x];
            }
            else {
                keywords.content += $scope.home.metaTags.keywords[x] + ",";
            }
        }

        // insert the meta tags
        document.head.appendChild(description);
        document.head.appendChild(keywords);
    }

    // on the destruction of the controller
    $scope.$on("$destroy", function handler() {
        // close the navigation menu
        closeNavMenu();
    });
});

// the About Me controller
app.controller('aboutMeController', function ($scope, $http, $compile) {

    // display the header if not displayed already
    if (!headerDisplayed) {
        displayHeader();
    }

    // display the footer if not displayed already
    if (!footerDisplayed) {
        displayFooter();
    }

    // hide the home body display
    hideBodyHomeID()


    // get the data from the JSON file
    $http.get('/external-files/data/about-me.json').success(function (data) {
        $scope.aboutme = data;
        var titleDOM = document.getElementById("pageTitle");
        var title = "\'" + $scope.aboutme.title + "\'";
        titleDOM.setAttribute("ng-bind-html", title);
        $compile(titleDOM)($scope);
        insertMetaData();
    });

    // insert the meta data
    function insertMetaData() {
        // create meta tags
        var description = document.createElement("meta");
        description.name = "description";
        description.content = $scope.aboutme.metaTags.description;
        var keywords = document.createElement("meta");
        keywords.name = "keywords";
        keywords.content = "";

        // loop through all keywords
        for (x = 0; x < $scope.aboutme.metaTags.keywords.length; x++) {
            // if this is the last element, don't add a comma
            if (x == $scope.aboutme.metaTags.keywords.length - 1) {
                keywords.content += $scope.aboutme.metaTags.keywords[x];
            }
            else {
                keywords.content += $scope.aboutme.metaTags.keywords[x] + ",";
            }
        }

        // insert the meta tags
        document.head.appendChild(description);
        document.head.appendChild(keywords);
    }

    // on the destruction of the controller
    $scope.$on("$destroy", function handler() {
        // close the navigation menu
        closeNavMenu();
    });
});

// the Resume controller
app.controller('resumeController', function ($scope, $http, $compile) {

    // display the header if not displayed already
    if (!headerDisplayed) {
        displayHeader();
    }

    // display the footer if not displayed already
    if (!footerDisplayed) {
        displayFooter();
    }

    // hide the home body display
    hideBodyHomeID()

    // get the data from the JSON file
    $http.get('/external-files/data/resume.json').success(function (data) {
        $scope.resume = data;
        var titleDOM = document.getElementById("pageTitle");
        var title = "\'" + $scope.resume.title + "\'";
        titleDOM.setAttribute("ng-bind-html", title);
        $compile(titleDOM)($scope);
        insertMetaData();
    });

    // insert the meta data
    function insertMetaData() {
        // create meta tags
        var description = document.createElement("meta");
        description.name = "description";
        description.content = $scope.resume.metaTags.description;
        var keywords = document.createElement("meta");
        keywords.name = "keywords";
        keywords.content = "";

        // loop through all keywords
        for (x = 0; x < $scope.resume.metaTags.keywords.length; x++) {
            // if this is the last element, don't add a comma
            if (x == $scope.resume.metaTags.keywords.length - 1) {
                keywords.content += $scope.resume.metaTags.keywords[x];
            }
            else {
                keywords.content += $scope.resume.metaTags.keywords[x] + ",";
            }
        }

        // insert the meta tags
        document.head.appendChild(description);
        document.head.appendChild(keywords);
    }

    // on the destruction of the controller
    $scope.$on("$destroy", function handler() {
        // close the navigation menu
        closeNavMenu();
    });
});

// the Portfolio controller
app.controller('portfolioController', function ($scope, $http, $compile, $rootScope, $compile, $location) {

    // display the header if not displayed already
    if (!headerDisplayed) {
        displayHeader();
    }

    // display the footer if not displayed already
    if (!footerDisplayed) {
        displayFooter();
    }

    // hide the home body display
    hideBodyHomeID()

    // get the data from the JSON file
    $http.get('/external-files/data/portfolio.json').success(function (data) {
        $scope.portfolio = data;
        $scope.currentPath = window.location.hash;
        var titleDOM = document.getElementById("pageTitle");
        var title = "\'" + $scope.portfolio.title + "\'";
        titleDOM.setAttribute("ng-bind-html", title);
        $compile(titleDOM)($scope);
        insertMetaData();
    });

    // insert the meta data
    function insertMetaData() {
        // create meta tags
        var description = document.createElement("meta");
        description.name = "description";
        description.content = $scope.portfolio.metaTags.description;
        var keywords = document.createElement("meta");
        keywords.name = "keywords";
        keywords.content = "";

        // loop through all keywords
        for (x = 0; x < $scope.portfolio.metaTags.keywords.length; x++) {
            // if this is the last element, don't add a comma
            if (x == $scope.portfolio.metaTags.keywords.length - 1) {
                keywords.content += $scope.portfolio.metaTags.keywords[x];
            }
            else {
                keywords.content += $scope.portfolio.metaTags.keywords[x] + ",";
            }
        }

        // insert the meta tags
        document.head.appendChild(description);
        document.head.appendChild(keywords);
    }

    // gets the title of the picture
    $scope.getPictureTitle = function (pictureLink) {
        //split string
        var splits = pictureLink.split('/');
        return splits[splits.length - 1];
    };
    
    // go to subpage link
    $scope.goToSubPageLink = function (subPageLink) {
        var path = $location.path + "/" + subPageLink;
        $location.path($location.path + "/" + subPageLink);
    }

    // on the destruction of the controller
    $scope.$on("$destroy", function handler() {
        // close the navigation menu
        closeNavMenu();
    });
});

// the Sub Portfolio controller
app.controller('subPortfolioController', function ($scope, $http, $filter, $sce, $window, $compile, $routeParams, $location) {

    // display the header if not displayed already
    if (!headerDisplayed) {
        displayHeader();
    }

    // display the footer if not displayed already
    if (!footerDisplayed) {
        displayFooter();
    }
    
    // hide the home body display
    hideBodyHomeID()

    // get the parameters
    var params = $routeParams.subPortfolioID;

    // the current index of the array of images
    var currentIndex = 0;

    // the switch image timing
    var imageSwitchTimer = 3000;
    var initialPicturePath = "/external-files/media/portfolio-images/";
    var jsonFilePath = "/external-files/data/";

    // start fading animation
    // wait a certain amount of seconds then call switchImage
    var timeoutHandle = $window.setTimeout(switchImage, imageSwitchTimer);

    // based on which page is currently loaded, set that picture path
    if (params == "drive-on-metz") {
        initialPicturePath += "driveonmetz/driveonmetz-logo.jpg";
        jsonFilePath += "drive-on-metz.json";
    }
    else if (params == "forsaken") {
        initialPicturePath += "forsaken/forsaken-logo.png";
        jsonFilePath += "forsaken.json";
    }
    else if (params == "memoryless") {
        initialPicturePath += "memoryless/memoryless-logo.jpg";
        jsonFilePath += "memoryless.json";
    }
    else if (params == "over-drive") {
        initialPicturePath += "overdrive/overdrive-logo.png";
        jsonFilePath += "over-drive.json";
    }
    else if (params == "road-rager") {
        initialPicturePath += "roadrager/roadrager-logo.png";
        jsonFilePath += "road-rager.json";
    }
    else if (params == "rollaball-mod") {
        initialPicturePath += "rollaballmod/rollaballmod-logo.png";
        jsonFilePath += "rollaball-mod.json";
    }
    else if (params == "squirvival") {
        initialPicturePath += "squirvival/squirvival-logo.png";
        jsonFilePath += "squirvival.json";
    }

    // the initial update video link
    var initialUpdateVideo = "";

    // the initial trailer video link
    var initialTrailerVideo = "";

    // get the data from the JSON file
    $http.get(jsonFilePath).success(function (data) {

        // get the data from the JSON file
        $scope.subPortfolio = data;
        var titleDOM = document.getElementById("pageTitle");
        var title = "\'" + $scope.subPortfolio.title + "\'";
        titleDOM.setAttribute("ng-bind-html", title);
        $compile(titleDOM)($scope);
        insertMetaData();

        // if the file has video updates
        if (data.videoUpdates.length > 0) {
            // set the initial video path
            initialUpdateVideo = data.videoUpdates[0].videoLink;
            $scope.startingUpdateVideo = $sce.trustAsResourceUrl(initialUpdateVideo);
        }

        // if the file has trailer videos
        if (data.trailerLink.length > 0) {
            // set the initial trailer video path
            initialTrailerVideo = data.trailerLink;
            $scope.trailerVideo = $sce.trustAsResourceUrl(initialTrailerVideo);
        }

        // initialize
        $scope.initializeController();
    });

    // insert the meta data
    function insertMetaData() {
        // create meta tags
        var description = document.createElement("meta");
        description.name = "description";
        description.content = $scope.subPortfolio.metaTags.description;
        var keywords = document.createElement("meta");
        keywords.name = "keywords";
        keywords.content = "";

        // loop through all keywords
        for (x = 0; x < $scope.subPortfolio.metaTags.keywords.length; x++) {
            // if this is the last element, don't add a comma
            if (x == $scope.subPortfolio.metaTags.keywords.length - 1) {
                keywords.content += $scope.subPortfolio.metaTags.keywords[x];
            }
            else {
                keywords.content += $scope.subPortfolio.metaTags.keywords[x] + ",";
            }
        }

        // insert the meta tags
        document.head.appendChild(description);
        document.head.appendChild(keywords);
    }

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
        if (subImages.length > 0)
        {
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
        if (subImages.length > 0)
        {
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
    $scope.initializeController = function ()
    {
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
            if (videoToChange)
            {
                // set the source
                videoToChange.src = initialTrailerVideo;
            }
        }
    }

    // gets the starting update video
    $scope.getStartingUpdateVideo = function () {
        return $sce.trustAsResourceUrl(initialUpdateVideo);
    }

    // gets the starting trailer video
    $scope.getStartingTrailerVideo = function () {
        return $sce.trustAsResourceUrl(initialTrailerVideo);
    }

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

    // normalize all carousel images
    function carouselNormalization () {
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
    }

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
    }

    // on the destruction of the controller
    $scope.$on("$destroy", function handler() {
        // close the navigation menu
        closeNavMenu();

        // clear out the timer
        $window.clearTimeout(timeoutHandle);
    });

    // once the document is ready
    $(document).ready(function () {
        // normalize all carousel images
        $window.setTimeout(carouselNormalization, 1000);
    });
});

// the Blog controller
app.controller('blogController', function ($scope, $http, $compile) {

    // display the header if not displayed already
    if (headerDisplayed) {
        hideHeader();
    }

    // display the footer if not displayed already
    if (footerDisplayed) {
        hideFooter();
    }

    // hide the home body display
    hideBodyHomeID()

    // get the data from the JSON file
    $http.get('/external-files/data/blog.json').success(function (data) {
        $scope.blog = data;
        var titleDOM = document.getElementById("pageTitle");
        var title = "\'" + $scope.blog.title + "\'";
        titleDOM.setAttribute("ng-bind-html", title);
        $compile(titleDOM)($scope);
        insertMetaData();
    });

    // insert the meta data
    function insertMetaData() {
        // create meta tags
        var description = document.createElement("meta");
        description.name = "description";
        description.content = $scope.blog.metaTags.description;
        var keywords = document.createElement("meta");
        keywords.name = "keywords";
        keywords.content = "";

        // loop through all keywords
        for (x = 0; x < $scope.blog.metaTags.keywords.length; x++) {
            // if this is the last element, don't add a comma
            if (x == $scope.blog.metaTags.keywords.length - 1) {
                keywords.content += $scope.blog.metaTags.keywords[x];
            }
            else {
                keywords.content += $scope.blog.metaTags.keywords[x] + ",";
            }
        }

        // insert the meta tags
        document.head.appendChild(description);
        document.head.appendChild(keywords);
    }

    // on the destruction of the controller
    $scope.$on("$destroy", function handler() {
        // close the navigation menu
        closeNavMenu();
    });
});

// the Contact controller
app.controller('contactController', function ($scope, $http, $compile) {

    // display the header if not displayed already
    if (!headerDisplayed) {
        displayHeader();
    }

    // display the footer if not displayed already
    if (!footerDisplayed) {
        displayFooter();
    }

    // hide the home body display
    hideBodyHomeID()

    // get the data from the JSON file
    $http.get('/external-files/data/contact.json').success(function (data) {
        $scope.contact = data;
        var titleDOM = document.getElementById("pageTitle");
        var title = "\'" + $scope.contact.title + "\'";
        titleDOM.setAttribute("ng-bind-html", title);
        $compile(titleDOM)($scope);
        insertMetaData();
    });

    // insert the meta data
    function insertMetaData() {
        // create meta tags
        var description = document.createElement("meta");
        description.name = "description";
        description.content = $scope.contact.metaTags.description;
        var keywords = document.createElement("meta");
        keywords.name = "keywords";
        keywords.content = "";

        // loop through all keywords
        for (x = 0; x < $scope.contact.metaTags.keywords.length; x++) {
            // if this is the last element, don't add a comma
            if (x == $scope.contact.metaTags.keywords.length - 1) {
                keywords.content += $scope.contact.metaTags.keywords[x];
            }
            else {
                keywords.content += $scope.contact.metaTags.keywords[x] + ",";
            }
        }

        // insert the meta tags
        document.head.appendChild(description);
        document.head.appendChild(keywords);
    }

    // on the destruction of the controller
    $scope.$on("$destroy", function handler() {
        // close the navigation menu
        closeNavMenu();
    });
});

// public functions

// displays the header
function displayHeader()
{
    // display the header
    var header = document.getElementById("masthead-container");
    header.style.display = "";
    var topBar = document.getElementById("top-bar");
    topBar.style.display = "";

    // show the header is currently displayed
    headerDisplayed = true;
}

// displays the footer
function displayFooter()
{
    // display the footer
    var footer = document.getElementById("footer-container");
    footer.style.display = "";

    // show the header is currently displayed
    footerDisplayed = true;
}

// switches the style of the body
function showBodyHomeID() {
    //document.body.style = "background-color: #000"; //"background-image: url(\'" + homeBackgroundPageLink + "\');" 
    document.body.className.replace("body-normal", "");
    document.body.className = "body-home";
}

// switches the style of the body
function hideBodyHomeID()
{
    //document.body.style = "background-image: url(\'" + normalBackgroundPageLink + "\'); z-index:-1:";
    document.body.className.replace("body-home", "");
    document.body.className = "body-normal";
}

// hides the header
function hideHeader()
{
    // hide the header
    var header = document.getElementById("masthead-container");
    header.style.display = "none";
    var topBar = document.getElementById("top-bar");
    topBar.style.display = "none";

    // show the header is not currently displayed
    headerDisplayed = false;
}

// hides the footer
function hideFooter() {

    // hide the footer
    var footer = document.getElementById("footer-container");
    footer.style.display = "none";

    // show the footer is not currently displayed
    footerDisplayed = false;
}

// closes the navigation menu 
function closeNavMenu() {
    // get the overlay nav
    var navOverlay = document.getElementById("overlay-nav");

    // check if the navOverly is displaying
    if (navOverlay && navOverlay.className == "open")
    {
        // remove class
        navOverlay.className = "closed";
    }

    // get the img and switch the image
    var navLinkIcon = document.getElementById("nav-icon-link");

    // if the icon has been found
    if (navLinkIcon) {
        navLinkIcon.src = "/external-files/media/icons/menu.png";
    }
}

// checks if the suburl data exists
function isCorrectSubUrl(url) {

    // get the location split
    var splits = url.split("/");
    var subUrl = splits[splits.length - 1];

    // based on which page is currently loaded, set that picture path
    if (subUrl == "drive-on-metz") {
        return true;
    }
    else if (subUrl == "forsaken") {
        return true;
    }
    else if (subUrl == "memoryless") {
        return true;
    }
    else if (subUrl == "over-drive") {
        return true;
    }
    else if (subUrl == "road-rager") {
        return true;
    }
    else if (subUrl == "rollaball-mod") {
        return true;
    }
    else if (subUrl == "squirvival") {
        return true;
    }
    else {
        return false;
    }
}

// checks if on a mobile browser
function mobileCheck()
{
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}