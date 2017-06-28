// dialog warning controller
angular.module('app').controller('dialogWarningController', ["$scope", "$rootScope", "ngDialog", 'Service', function ($scope, $rootScope, ngDialog, Service) {

}]);

// discard blog draft controller
app.controller('dialogDiscardBlogDraftController', ["$scope", "$rootScope", 'ngDialog', 'Service', function ($scope, $rootScope, ngDialog, Service) {
    // shows this is the discard blog draft controller
    $scope.dialogDiscardBlogDraftController = true;

    // the warning head 
    $scope.warningHead = "GEEZ !?!?";

    // the warning body
    $scope.warningBody = "Woah there, you are about to discard this draft, are you positive !?";

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
app.controller('dialogDeleteBlogController', ["$scope", "$rootScope", 'ngDialog', 'Service', function ($scope, $rootScope, ngDialog, Service) {
    // shows this is the delete blog controller
    $scope.dialogDeleteBlogController = true;

    // the warning head 
    $scope.warningHead = "GEEZ !?!?";

    // the warning body
    $scope.warningBody = "Woah there, you are about to delete the blog '" + $scope.ngDialogData.blogToBeDeleted.title + "', are you positive !?";

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