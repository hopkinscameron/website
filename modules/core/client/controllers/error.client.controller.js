'use strict';

// set up the module
var coreModule = angular.module('core');

// create the controller
coreModule.controller('ErrorController', ['$scope', '$compile', '$route', 'Service', function ($scope, $compile, $route, Service) {
    // set the title/code/message of the error
    // FIXME: had these as "const" is there a way to keep this during minification
    var title = $route.current.$$route && $route.current.$$route.errorTitle ? $route.current.$$route.errorTitle : 'Page Not Found';
    var code = $route.current.$$route && $route.current.$$route.errorCode ? $route.current.$$route.errorCode : 404;
    var message = $route.current.$$route && $route.current.$$route.errorMessage ? $route.current.$$route.errorMessage : 'Sorry, looks like the page you were looking for does not exist.';
    
    // initialize
    $scope.pageTitle = title + ' | ' + ApplicationConfiguration.applicationName;
    $scope.status = code; 
    $scope.message = message; 

    // setup page
    initialize(title, $scope.status, $scope.message);

    // initialization of controller
    $scope.init = function(title, status, message)
    {
        initialize(title, status, message);
    };

    // on the destruction of the controller
    $scope.$on('$destroy', function handler() {
        // get body
        var body = angular.element(document.body);

        // if correct css, remove it
        if(body && body.hasClass('body-error')) {
            body.removeClass('body-error');
        }
    });
    
    // initialize the page
    function initialize(title, status, message) {
        // initialize
        $scope.pageTitle = title ? title + ' | ' + ApplicationConfiguration.applicationName : $scope.pageTitle;
        $scope.status = status ? status : $scope.status;
        $scope.message = message ? message : $scope.message;

        // get correct error code
        switch(status) {
            case 400:
                $scope.image = '/dist/img/errors/400.png';
                break;
            case 401:
                $scope.image = '/dist/img/errors/401.png';
                break;
            case 403:
                $scope.image = '/dist/img/errors/403.png';
                break;
            case 404:
                $scope.image = '/dist/img/errors/404.png';
                break;
            case 500:
                $scope.image = '/dist/img/errors/500.png';
                break;
            default:
                $scope.image = '/dist/img/errors/404.png';
        }

        // setup page
        setUpPage();
    };

    // sets up the page
    function setUpPage() {
        // set up the title
        var titleDOM = document.getElementById('pageTitle');
        var title = '\'' + $scope.pageTitle + '\'';
        titleDOM.setAttribute('ng-bind-html', title);
        $compile(titleDOM)($scope);

        // get body
        var body = angular.element(document.body);

        // if not correct css, add it
        if(body && !body.hasClass('body-error')) {
            body.addClass('body-error');
        }
    };
}]);