// dialog error controller
angular.module('app').controller('dialogErrorController', ["$scope", "$rootScope", "ngDialog", 'Service', function ($scope, $rootScope, ngDialog, Service) {
    // shows this is the error controller
    $scope.dialogErrorController = true;

    // okay
    $scope.okay = function () {
        // close the dialog
        ngDialog.close($scope.ngDialogData.ngDialogId);
    };
}]);