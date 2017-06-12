angular.module('app').controller('footerController', ['$scope', '$rootScope', 'Service', function ($scope, $rootScope, Service) {
    // initialize show footer
    $rootScope.$root.showFooter = true;

    // the footer backend data
    $scope.footer = {};

    // get the footer information
    getFooterInformation();

    // initializes the backend data
    function getFooterInformation() {
        // get the footer information
        Service.getFooterInformation().then(function (responseF) {
            // set the footer
            $scope.footer = responseF;
        })
        .catch(function (responseF) {
            // TODO: display something instead
            console.log(responseF.message);
        });
    };
}]);