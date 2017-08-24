'use strict'

// set up the module
var dialogModule = angular.module('dialog');

// create the controller
dialogModule.controller('DialogLoadingController', ['$scope', '$timeout', 'ngDialog', function ($scope, $timeout, ngDialog) {
    // holds the message
    $scope.message = 'Loading...';

    // holds the timeout time
    var timeout = 500;

    // change text after timeout
    $timeout(changeText, timeout);

    // change the text
    function changeText() {
        if($scope.message == 'Loading.') {
            $scope.message = 'Loading..';
        }
        else if($scope.message == 'Loading..') {
            $scope.message = 'Loading...';
        }
        else if($scope.message == 'Loading...') {
            $scope.message = 'Loading.';
        }
        else {
            $scope.message = 'Loading.';
        }

        // change text after timeout
        $timeout(changeText, timeout);
    };
}]);