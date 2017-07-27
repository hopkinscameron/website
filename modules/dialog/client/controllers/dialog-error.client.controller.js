// dialog error controller
angular.module('app').controller('DialogErrorController', ["$scope", "$rootScope", "ngDialog", 'Service', function ($scope, $rootScope, ngDialog, Service) {
    // shows this is the error controller
    $scope.DialogErrorController = true;

    // okay
    $scope.okay = function () {
        // close the dialog
        ngDialog.close($scope.ngDialogData.ngDialogId);
    };
}]);