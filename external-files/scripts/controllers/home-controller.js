
// load the data for the Home page
loadHomePageData();

// loads the data for the Home page
function loadHomePageData() {
    var app = angular.module('homeApp', []);
    app.controller('homeController', function ($scope, $http) {
        $http.get('/external-files/data/home.json').success(function (data) {
            $scope.home = data;
        });
    });
}