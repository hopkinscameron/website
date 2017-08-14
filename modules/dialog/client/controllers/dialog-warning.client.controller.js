'use strict'

// set up the module
var dialogModule = angular.module('dialog');

// create the controller
dialogModule.controller('DialogWarningController', ['$scope', 'ngDialog', function ($scope, ngDialog) {

}]);

// discard blog draft controller
dialogModule.controller('DialogDiscardBlogDraftController', ['$scope', 'ngDialog', function ($scope, ngDialog) {
    // shows this is the discard blog draft controller
    $scope.DialogDiscardBlogDraftController = true;

    // the warning head 
    $scope.warningHead = 'GEEZ !?!?';

    // the warning body
    $scope.warningBody = 'Woah there, you are about to discard this draft, are you positive !?';

    // cancel
    $scope.cancel = function () {
        // close the dialog
        ngDialog.close($scope.ngDialogData.ngDialogId, { 'accepted': false });
    };

    // discard draft
    $scope.discardDraft = function () {
        // close the dialog
        ngDialog.close($scope.ngDialogData.ngDialogId, { 'accepted': true, 'draftToBeDiscarded': $scope.ngDialogData.draftToBeDiscarded });
    };
}]);

// delete blog controller
dialogModule.controller('DialogDeleteBlogController', ['$scope', 'ngDialog', function ($scope, ngDialog) {
    // shows this is the delete blog controller
    $scope.DialogDeleteBlogController = true;

    // the warning head 
    $scope.warningHead = 'GEEZ !?!?';

    // the warning body
    $scope.warningBody = 'Woah there, you are about to delete the blog \'' + $scope.ngDialogData.blogToBeDeleted.title + '\', are you positive !?';

    // cancel
    $scope.cancel = function () {
        // close the dialog
        ngDialog.close($scope.ngDialogData.ngDialogId, { 'accepted': false });
    };

    // delete blog
    $scope.deleteBlog = function () {
        // close the dialog
        ngDialog.close($scope.ngDialogData.ngDialogId, { 'accepted': true, 'blogToBeDeleted': $scope.ngDialogData.blogToBeDeleted });
    };
}]);