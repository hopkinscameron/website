'use strict'

// set up the module
var homeModule = angular.module('home');

// create the controller
homeModule.controller('HomeController', ['$scope', '$rootScope', '$compile', '$location', '$timeout', '$window', 'Service', 'HomeFactory', function ($scope, $rootScope, $compile, $location, $timeout, $window, Service, HomeFactory) {
    // determines if a page has already sent a request for load
    var pageRequested = false;
    
    // set jQuery
    $ = window.jQuery;

    // set the path
    Service.afterPath = $location.path();

    // holds the error
    $scope.error = {
        'error': false,
        'title': '',
        'status': 404,
        'message': ''
    };

    // the initial text to display to the user
    $scope.initialText = {
        'id': 'initialText',
        'display': false,
        'text': 'The portfolio of Cameron Hopkins'        
    };

    // the next text to display to the user
    $scope.secondText = {
        'id': 'secondText',
        'display': false,
        'text': 'Come take a look...'        
    };

    // the enter button display settings
    $scope.enterButton = {
        'id': 'enterButton',
        'display': false,
        'text': 'Enter'
    }

    // set window height
    $scope.windowHeight = {
        'height': $( window ).height() - 90
    }

    // get body
    var body = angular.element(document.body);

    // if not correct css, add it
    if(body && !body.hasClass('body-home')) {
        body.addClass('body-home');
    }

    // on resize
    angular.element($window).resize(function() {
        $scope.$apply(function () {
                $scope.windowHeight = {
                'height': angular.element(window).height() - 90
            }
        });
    });
    
    // determines if the page is fully loaded
    $scope.pageFullyLoaded = false;

    // check if header/footer was initialized
    if($rootScope.$root.showHeader === undefined || $rootScope.$root.showFooter === undefined) {
        // refresh header
        $rootScope.$emit('refreshHeader', {});

        // refresh footer
        $rootScope.$emit('refreshFooter', {});
    }
    else {
        // always refresh header to ensure home
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

    // on the destruction of the controller
    $scope.$on('$destroy', function handler() {
        // remove class
        if(body) {
            body.removeClass('body-home');
        }
    });

    // initialize page
    function initializePage() {
        // hide the header if shown     
        if ($rootScope.$root.showHeader) {
            $rootScope.$root.showHeader = false;
        }

        // hide the footer if shown
        if ($rootScope.$root.showFooter) {
            $rootScope.$root.showFooter = false;
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
        // get home page data
        HomeFactory.getHomePageInformation().then(function (responseH) {
            // if returned a valid response
            if (!responseH.error) {
                // set the data
                $scope.home = responseH;

                // holds the page title
                $scope.pageTitle = 'Home | ' + ApplicationConfiguration.applicationName;

                // setup page
                setUpPage();
            }
            else {
                // set error
                $scope.pageTitle = responseH.title;
                $scope.error.error = true;
                $scope.error.title = responseH.title;
                $scope.error.status = responseH.status;
                $scope.error.message = responseH.message;

                // setup page
                setUpPage();
            }
        })
        .catch(function (responseH) {
            // set error
            $scope.pageTitle = responseH.title;
            $scope.error.error = true;
            $scope.error.title = responseH.title;
            $scope.error.status = responseH.status;
            $scope.error.message = responseH.message;

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

        // set page fully loaded
        $scope.pageFullyLoaded = true;

        // if not an error
        if(!$scope.error.error) {
            // show next item
            $timeout(function() { showNextItem($scope.initialText, 'animated animation-delay--sm fadeIn') }, 500);
        }
    };

    // show next item
    function showNextItem(item, classToAdd) {
        // display
        if(item.id == 'initialText') {
            $scope.$apply(function () {
                $scope.initialText.display = true;
            });
        }
        else if(item.id == 'enterButton') {
            $scope.$apply(function () {
                $scope.enterButton.display = true;
            });
        }

        // add animation
        angular.element(document.querySelector('#' + item.id)).addClass(classToAdd).one($rootScope.$root.animationEnd, function () {
            // if initial text
            if(item.id == 'initialText') {
                // remove animation
                angular.element(document.querySelector('#' + item.id)).removeClass(classToAdd);
                
                // show button
                $timeout(function() { showNextItem($scope.enterButton, 'animated fadeInUp') }, 1000);
            }
        });
    };
}]);