'use strict'

// dialog success controller
angular.module('app').controller('DialogSuccessController', ["$scope", "$rootScope", "ngDialog", 'Service', function ($scope, $rootScope, ngDialog, Service) {
	// shows this is the success controller
    $scope.DialogSuccessController = true;

    // okay
    $scope.okay = function () {
        // close the dialog
        ngDialog.close($scope.ngDialogData.ngDialogId);
    };
}]);

// dialog successful post controller
angular.module('app').controller('DialogSuccessfulPostController', ["$scope", "$rootScope", "ngDialog", 'Service', function ($scope, $rootScope, ngDialog, Service) {
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