'use strict'

// set up the module
var dialogModule = angular.module('dialog');

// create the controller
dialogModule.controller('DialogErrorController', ['$scope', 'ngDialog', function ($scope, ngDialog) {
    // shows this is the error controller
    $scope.DialogErrorController = true;

    // okay
    $scope.okay = function () {
        // close the dialog
        ngDialog.close($scope.ngDialogData.ngDialogId);
    };
}]);