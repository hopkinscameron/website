'use strict';

// set up the module
var coreModule = angular.module('core');

// create the controller
coreModule.controller('ErrorController', ['$scope', '$compile', 'Service', function ($scope, $compile, Service) {
    // initialize
    $scope.pageTitle = 'Page not found' + ' | ' + ApplicationConfiguration.applicationName;
    $scope.status = 404; 
    $scope.message = 'The page you are looking for does not exist'; 

    // setup page
    initialize('Page not found', $scope.status, $scope.message);

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
                $scope.image = '/modules/core/client/img/errors/404.png';
                break;
            case 401:
                $scope.image = '/modules/core/client/img/errors/401.png';
                break;
            case 403:
                $scope.image = '/modules/core/client/img/errors/403.png';
                break;
            case 404:
                $scope.image = '/modules/core/client/img/errors/404.png';
                break;
            case 500:
                $scope.image = '/modules/core/client/img/errors/500.png';
                break;
            default:
                $scope.image = '/modules/core/client/img/errors/404.png';
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