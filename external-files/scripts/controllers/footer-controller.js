
// load the data for the Footer
loadFooterData();

// loads the data for the Footer
function loadFooterData() {
    angular.module('resumeApp').controller('footerController', function ($scope, $http) {
        $http.get('/external-files/data/footer.json').success(function (data) {
            $scope.footer = data;
        });
    });
}