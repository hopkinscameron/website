angular.module('app').controller('footerController', ['$scope', '$rootScope', 'Service', function ($scope, $rootScope, Service) {
    // initialize variables
    initializeVariables() ;

    // get the footer information
    getFooterInformation();

    // on refresh
    $rootScope.$on("refreshFooter", function (event, data) {
        // initialize variables
        initializeVariables() ;

        // get the footer information
        getFooterInformation();
    });

    // initialize variables
    function initializeVariables () {
        // initialize show footer
        $rootScope.$root.showFooter = true;

        // the footer backend data
        $scope.footer = {};
    };

    // initializes the backend data
    function getFooterInformation() {
        // get the footer information
        Service.getFooterInformation().then(function (responseF) {
            // set the footer
            $scope.footer = responseF;

            // footer refreshed
            $rootScope.$emit("footerRefreshed", {});
        })
        .catch(function (responseF) {
            // footer refreshed with error
            $rootScope.$emit("footerRefreshed", {"error": true, "message": responseF.message});
        });
    };
}]);