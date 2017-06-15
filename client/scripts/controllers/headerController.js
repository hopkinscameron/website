﻿// the Header Controller
angular.module('app').controller('headerController', ['$scope', '$rootScope', '$location', '$window', 'Service', function ($scope, $rootScope, $location, $window, Service) {
    // initialize variables
    initializeVariables();

    // get the header information
    getHeaderInformation();
    
    // on refresh
    $rootScope.$on("refreshHeader", function (event, data) {
        // initialize variables
        initializeVariables();

        // get the header information
        getHeaderInformation();
    });

    // checks if the page is active
    $scope.isActive = function (page) {
        var windowSplit = $window.location.href.split('/');
        var pageSplit = page.split('/');
        var last = windowSplit[windowSplit.length - 1];
        var queryIndex = last.indexOf("?");

        // if query
        if(queryIndex != -1) {
            last = last.substring(0, queryIndex);
        }

        // check if on page
        if (last == pageSplit[pageSplit.length - 1]) {
            // set the class as active
            return true;
        }

        return false;
    };

    // initialize variables
    function initializeVariables () {
        // set jQuery
        $rootScope.$root.$ = window.jQuery;

        // set animations
        $rootScope.$root.animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

        // initialize show header
        $rootScope.$root.showHeader = false;

        // holds the header backend data
        $scope.header = {};

        // set up all regex's
        setUpRegex();
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
        // set the app name
        Service.setAppName().then(function (responseAN) {
            // get the header information
            Service.getHeaderInformation().then(function (responseHeader) {
                // set the header
                $scope.header = responseHeader;

                // header refreshed
                $rootScope.$emit("headerRefreshed", {});
            })
            .catch(function (responseHeader) {
                // header refreshed with error
                $rootScope.$emit("headerRefreshed", {"error": true, "message": responseHeader.message});
            });
        });
    };
}]);