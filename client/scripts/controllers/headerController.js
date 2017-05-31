// the Header Controller
angular.module('app').controller('headerController', ['$scope', '$rootScope', '$location', '$window', 'Service', function ($scope, $rootScope, $location, $window, Service) {
    // set jQuery
    $rootScope.$root.$ = window.jQuery;

    // set animations
    $rootScope.$root.animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

    // holds the header backend data
    $scope.header = {};

    // set up all regex's
    setUpRegex();

    // the 768 media query
    var mq = window.matchMedia("(max-width: 767px)");

    // media query event handler
    if (matchMedia) {
        mq.addListener(WidthChange);
        WidthChange(mq);
    }

    // get the header information
    getHeaderInformation();

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

    $scope.goHome = function (newPath) {
        // go home
        $location.path(newPath)
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
    };

    // sets up the regex
    function setUpRegex() {
        // email regex
        $rootScope.$root.emailRegex = /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        // url regex
        $rootScope.$root.url = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    };

    // gets the header information
    function getHeaderInformation() {
        // get the header information
        Service.getHeaderInformation().then(function (responseHeader) {
            // set the header
            $scope.header = responseHeader;
        })
        .catch(function (responseHeader) {
            // TODO: Error out
        });
    };
}]);