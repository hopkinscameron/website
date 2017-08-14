'use strict'

// set up the module
var dialogModule = angular.module('dialog');

// create the controller
dialogModule.controller('DialogSuccessController', ['$scope', 'ngDialog', function ($scope, ngDialog) {
	// shows this is the success controller
    $scope.DialogSuccessController = true;

    // okay
    $scope.okay = function () {
        // close the dialog
        ngDialog.close($scope.ngDialogData.ngDialogId);
    };
}]);

// dialog successful post controller
dialogModule.controller('DialogSuccessfulPostController', ['$scope', 'ngDialog', function ($scope, ngDialog) {
	// shows this is the successful post controller
    $scope.DialogSuccessfulPostController = true;

    // okay
    $scope.okay = function () {
        // close the dialog
        ngDialog.close($scope.ngDialogData.ngDialogId);
    };

    // go to blog
    $scope.goToBlog = function () {
        // close the dialog
        ngDialog.close($scope.ngDialogData.ngDialogId, { 'accepted': true });
    };
}]);