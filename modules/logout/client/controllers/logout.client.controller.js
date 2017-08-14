'use strict'

// set up the module
var logoutModule = angular.module('logout');

// create the controller
logoutModule.controller('LogoutController', ['$scope', '$rootScope', '$compile', '$window', 'LogoutFactory', function ($scope, $rootScope, $compile, $window, LogoutFactory) {
    // holds the error
    $scope.error = {
        'error': false,
        'title': '',
        'status': 404,
        'message': ''
    };
    
    // logout
    LogoutFactory.logout().then(function (responseL) {
        // if no error
        if(!responseL.error) {
            // redirect to home page
            $window.location.href = '#/about';

            // refresh header
            $rootScope.$emit('refreshHeader', {});
        }
        else {
            // set error
            $scope.pageTitle = responseL.title;
            $scope.error.error = true;
            $scope.error.title = responseL.title;
            $scope.error.status = responseL.status;
            $scope.error.message = responseL.message;

            // setup page
            setUpPage();
        }
    })
    .catch(function (responseL) {
        // set error
        $scope.pageTitle = responseL.title;
        $scope.error.error = true;
        $scope.error.title = responseL.title;
        $scope.error.status = responseL.status;
        $scope.error.message = responseL.message;

        // setup page
        setUpPage();
    });

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
}]);