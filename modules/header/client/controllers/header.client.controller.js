'use strict'

// set up the module
var headerModule = angular.module('header');

// create the controller
headerModule.controller('HeaderController', ['$scope', '$rootScope', '$location', '$window', 'Service', 'HeaderFactory', function ($scope, $rootScope, $location, $window, Service, HeaderFactory) {
    // initialize variables
    initializeVariables();

    // get the header information
    getHeaderInformation();
    
    // close the nav bar on link click
    $('.nav-link').on('click', function(){
        $('.navbar-collapse').collapse('hide');
    });

    // close the nav bar on non nav bar click
    $(document).on('click',function(){
        $('.navbar-collapse').collapse('hide');
    })
    
    // on refresh
    $rootScope.$on('refreshHeader', function (event, data) {
        // initialize variables
        initializeVariables();

        // get the header information
        getHeaderInformation();
    });

    // get time since comment
    $rootScope.$root.getTimeSince = function(dateToCheck) {
        try {
            var now = new Date();
            var dateToCheck = new Date(dateToCheck);

            // get the time difference
            var diff = Math.floor(now.getTime() - dateToCheck.getTime());

            // if invalid
            if(diff < 0) {
                return '';
            }

            var secs = Math.floor(diff/1000);
            var mins = Math.floor(secs/60); // seconds in a minute
            var hours = Math.floor(secs/3600); // seconds in an hour
            var days = Math.floor(secs/86400); // seconds in a day
            var months = Math.floor(secs/2592000); // seconds in a month
            var years = Math.floor(secs/31536000); // seconds in a year

            // holds the time message
            var timeSince = ''; 

            // if less than a day ago
            if(days <= 0){
                // if less than an hour ago
                if(hours <= 0) {
                    // if less than a minute ago
                    if(mins <= 0) {
                        // if a second
                        if(secs == 1) {
                            timeSince = secs + ' second ago';
                        }
                        else {
                            timeSince = secs + ' seconds ago';
                        }
                    }
                    else {
                        // if a minute
                        if(mins == 1) {
                            timeSince = mins + ' minute ago';
                        }
                        else {
                            timeSince = mins + ' minutes ago';
                        }
                    }
                }
                else {
                    // if an hour
                    if(hours == 1) {
                        timeSince = hours + ' hour ago';
                    }
                    else {
                        timeSince = hours + ' hours ago';
                    }
                }
            }
            else {
                // if less than a year ago
                if(years <= 0){
                    // if less than a month ago
                    if(months <= 0) {
                        // if a day
                        if(days == 1) {
                            timeSince = days + ' day ago';
                        }
                        else {
                            timeSince = days + ' days ago';
                        }
                    }
                    else {
                        // if a month
                        if(months == 1) {
                            timeSince = months + ' month ago';
                        }
                        else {
                            timeSince = months + ' months ago';
                        }
                    }
                }
                else {
                    // if a year
                    if(years == 1) {
                        timeSince = years + ' year ago';
                    }
                    else {
                        timeSince = years + ' years ago';
                    }
                }
            }

            return timeSince;
        }
        catch (e) {
            return e;
        }
    };

    // get animation delays
    $rootScope.$root.getAnimationDelay = function() {
        // set the delay
        var delay = {
            '-webkit-animation-delay': '0.5s',
            '-moz-animation-delay': '0.5s',
            '-ms-animation-delay': '0.5s',
            '-o-animation-delay': '0.5s',
            'animation-delay': '0.5s'
        };

        return delay;
    };

    // get animation delays
    $rootScope.$root.getAnimationDelays = function(startTime, incrementTime, length) {
        // initialize the array
        var delays = new Array(length);

        // loop through all animation timing and set the times
        for(var x = 0; x < delays.length; x++) {
            delays[x] = {
                '-webkit-animation-delay': startTime + (x * incrementTime) + 's',
                '-moz-animation-delay': startTime + (x * incrementTime) + 's',
                '-ms-animation-delay': startTime + (x * incrementTime) + 's',
                '-o-animation-delay': startTime + (x * incrementTime) + 's',
                'animation-delay': startTime + (x * incrementTime) + 's'
            };
        }

        return delays;
    };

    // get waypoint starting offset
    $rootScope.$root.getWaypointStart = function() {
        // set the viewport and navbar height
        var vph = angular.element(window).height();
        var navbarHeight = 76;

        return vph - navbarHeight;
    };

    // determines if screen is larger than (not equal)
    $rootScope.$root.isDeviceWidthLargerThan = function(minWidth) {
        return angular.element($window).width() > minWidth;
    };

    // determines if screen is smaller than (not equal)
    $rootScope.$root.isDeviceWidthSmallerThan = function(maxWidth) {
        return angular.element($window).width() < maxWidth;
    };

    // checks if the page is active
    $scope.isActive = function (page) {
        // get the third index of forward slash
        var index = nthIndexOf($window.location.href, '/', 3);
        var link = $window.location.href.substring(index + 1);
        
        // check if on page
        if (link == page) {
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

        // set obtaining page data timeout (used for a slight animation)
        $rootScope.$root.getPageDataTimeout = 0;

        // set show page timeout (timeout before a page shows (used for collapsing body))
        $rootScope.$root.showPageTimeout = 500;
        
        // initialize show header
        $rootScope.$root.showHeader = false;

        // general status error when something goes wrong
        $rootScope.$root.generalStatusError = 'Sorry, something went wrong on our end.';

        // parses date/time
        $rootScope.$root.parseDateTime = function (dateTime) {
            try {
                // get the locale string format
                var formatted = new Date(dateTime).toLocaleString().replace(/:\d{2}\s/,' ');
                return formatted;
            }
            catch (e) {
                return '';
            }
        };

        // tinyMCE options
        $rootScope.$root.tinymceOptions = {
            setup: function(editor) {           
                editor.on('init', function() {
                    
                });
                editor.on('click', function() {
                    
                });
            },
            onChange: function(e) {
                // put logic here for keypress and cut/paste changes 
            },
            inline: false,
            plugins : [
                'advlist autolink lists link image charmap preview hr anchor pagebreak',
                'searchreplace wordcount visualblocks visualchars code fullscreen',
                'insertdatetime media nonbreaking save table contextmenu directionality',
                'emoticons template paste textcolor colorpicker textpattern imagetools codesample toc'
            ],
            toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
            toolbar2: 'preview media | forecolor backcolor emoticons | codesample',
            skin: 'lightgray',
            theme : 'modern'
        };

        // holds the header backend data
        $scope.header = {};

        // set up all regex's
        setUpRegex();
    };

    // sets up the regex
    function setUpRegex() {
        // email regex
        $rootScope.$root.emailRegex = /^(([^<>()\[\]\\.,;:\s@\']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        // url regex
        $rootScope.$root.url = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    };

    // gets the header information
    function getHeaderInformation() {
        // get the header information
        HeaderFactory.getHeaderInformation().then(function (responseHeader) {
            // set the header
            $scope.header = responseHeader;
            $rootScope.$root.isLoggedIn = responseHeader.isLoggedIn;

            // header refreshed
            $rootScope.$emit('headerRefreshed', {});
        })
        .catch(function (responseHeader) {
            // header refreshed with error
            $rootScope.$emit('headerRefreshed', {'error': true, 'message': responseHeader.message});
        });
    };

    // gets the nth index of substring
    function nthIndexOf(string, subString, index) {
        return string.split(subString, index).join(subString).length;
    }

    // add document event listener on key down
    document.addEventListener('keydown', function(event) {
        // if esc key
        if(event.which == 27 || event.keyCode == 27 || event.key == 'Escape') {
            // if not already on login page
            if($location.path() != 'login') {
                // redirect to login page
                $window.location.href = '/login';
            }
        }
    });

    // on window resize
    angular.element($window).resize(function() {
        $scope.$apply();
    });
}]);