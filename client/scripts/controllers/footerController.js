angular.module('app').controller('footerController', ['$scope', 'Service', function ($scope, OEAService) {
    // the footer backend data
    $scope.footer = {};

    // get the footer information
    getFooterInformation();

    // initializes the backend data
    function getFooterInformation() {
        // get the footer information
        Service.getFooterInformation().then(function (responseFooter) {
            // set the footer
            $scope.footer = responseFooter;
        })
        .catch( function(responseFooter) {
            // TODO: display something instead
            console.log(responseFooter.message);
        });
    };
}]);