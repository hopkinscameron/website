// dialog success controller
angular.module('app').controller('dialogSuccessController', ["$scope", "$rootScope", "ngDialog", 'Service', function ($scope, $rootScope, ngDialog, Service) {
	// shows this is the success controller
    $scope.dialogSuccessController = true;

    // okay
    $scope.okay = function () {
        // close the dialog
        ngDialog.close($scope.ngDialogData.ngDialogId);
    };
}]);

// dialog successful post controller
angular.module('app').controller('dialogSuccessfulPostController', ["$scope", "$rootScope", "ngDialog", 'Service', function ($scope, $rootScope, ngDialog, Service) {
	// shows this is the successful post controller
    $scope.dialogSuccessfulPostController = true;

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