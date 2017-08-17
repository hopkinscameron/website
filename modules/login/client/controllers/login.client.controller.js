'use strict'

// set up the module
var loginModule = angular.module('login');

// create the controller
loginModule.controller('LoginController', ['$scope', '$rootScope', '$compile', '$location', '$window', '$timeout', 'Service', 'LoginFactory', function ($scope, $rootScope, $compile, $location, $window, $timeout, Service, LoginFactory) {
    // determines if a page has already sent a request for load
    var pageRequested = false;
    
    // set jQuery
    $ = window.jQuery;

    // previous path
    var previousPath = Service.afterPath;

    // set the path
    Service.afterPath = $location.path();

    // holds the error
    $scope.error = {
        'error': false,
        'title': '',
        'status': 404,
        'message': ''
    };

    // holds the login form data
    $scope.loginForm = {
        'formSubmitted': false,
        'inputs': {
            'username': 'cam',
            'password': '0000'
        },
        'views': {
            'username': 'username',
            'password': 'password'
        },
        'errors': {
            'errorMessage': '',
            'isError': false,
            'username': false,
            'password': false
        }
    };

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
        // always refresh header to ensure login
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

    // on call event when the focus enters
    $scope.viewFocusEnter = function (viewId) {
        // if entering the username view
        if (viewId == $scope.loginForm.views.username) {
            // reset the error
            $scope.loginForm.errors.username = false;
        }
        // if entering the password view
        else if (viewId == $scope.loginForm.views.password) {
            // reset the error
            $scope.loginForm.errors.password = false;
        }
    };

    // on call event when the focus leaves
    $scope.viewFocusLeave = function (viewId) {
        // if entering the username view
        if (viewId == $scope.loginForm.views.username) {
            // if user left field blank
            if ($scope.loginForm.inputs.username.length == 0) {
                // set error
                $scope.loginForm.errors.username = true;
                $scope.loginForm.errors.isError = true;
            }
        }
        // if entering the password view
        else if (viewId == $scope.loginForm.views.password) {
            // if user left field blank
            if ($scope.loginForm.inputs.password.length == 0) {
                // set error
                $scope.loginForm.errors.password = true;
                $scope.loginForm.errors.isError = true;
            }
        }
        
        // check to see if there is an error
        if ($scope.loginForm.errors.username) {
            // set error
            $scope.loginForm.errors.errorMessage = 'You must enter the username';
        }
        else if ($scope.loginForm.errors.password) {
            // set error
            $scope.loginForm.errors.errorMessage = 'You must enter the password';
        }
        else {
            // remove error
            $scope.loginForm.errors.errorMessage = '';
            $scope.loginForm.errors.isError = false;
        }
    };

    // login
    $scope.login = function () {
        // check for empty values
        checkEmptyValues();

        // check if an error exists
        if(!$scope.loginForm.errors.username && !$scope.loginForm.errors.password) {
            // disable button but showing the form has been submitted
            $scope.loginForm.formSubmitted = true;

            // the data to send
            var loginData = {
                'username': $scope.loginForm.inputs.username,
                'password': $scope.loginForm.inputs.password
            };

            // login
            LoginFactory.login(loginData).then(function (responseL) {
                // if no error
                if(!responseL.error) {
                    // if was on a previous route
                    if(previousPath && previousPath.length > 0) {
                        // redirect to previous page and reload page to refresh user object
                        $window.location.href = '/' + previousPath;
                    }
                    else {
                        // redirect to about page and reload page to refresh user object
                        $window.location.href = '/about';
                    }

                    // refresh header
                    $rootScope.$emit('refreshHeader', {});
                }
                else {
                    // show error
                    $scope.loginForm.errors.errorMessage = responseL.message;
                    $scope.loginForm.errors.isError = true;
                    $scope.loginForm.formSubmitted = false;
                }
            })
            .catch(function (responseL) {
                // show error
                $scope.loginForm.errors.errorMessage = responseL.message;
                $scope.loginForm.errors.isError = true;
                $scope.loginForm.formSubmitted = false;
            });
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
        // check if user is logged in
        LoginFactory.isUserLoggedIn().then(function (responseL) {
            // if no error
            if(!responseL.error) {
                // if user is not logged in
                if(!responseL.isLoggedIn) {
                    // holds the page title
                    $scope.pageTitle = 'Login | ' + ApplicationConfiguration.applicationName;
                    
                     // setup page
                    setUpPage();
                }
                // if a redirect callback
                else if($location.search().redirect){
                    // redirect to previous page
                    $window.location.href = '/' + $location.search().redirect;
                }
                else {
                    // redirect to about page
                    $window.location.href = '/about';
                }
            }
            else {
                // show error
                $scope.loginForm.errors.errorMessage = responseL.message;
                $scope.loginForm.errors.isError = true;
                $scope.loginForm.formSubmitted = false;
            }
        })
        .catch(function (responseL) {
            // show error
            $scope.loginForm.errors.errorMessage = responseL.message;
            $scope.loginForm.errors.isError = true;
            $scope.loginForm.formSubmitted = false;
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

    // checks for any empty values
    function checkEmptyValues() {
        // check for any empty values
        if (!$scope.loginForm.inputs.password || $scope.loginForm.inputs.password.length == 0) {
            // set error
            $scope.loginForm.errors.errorMessage = 'You must enter the password';
            $scope.loginForm.errors.password = true;
            $scope.loginForm.errors.isError = true;
        }
        if (!$scope.loginForm.inputs.username || $scope.loginForm.inputs.username.length == 0) {
            // set error
            $scope.loginForm.errors.errorMessage = 'You must enter the username';
            $scope.loginForm.errors.username = true;
            $scope.loginForm.errors.isError = true;
        }
    };
}]);