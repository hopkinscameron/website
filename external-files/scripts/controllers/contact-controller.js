
// load the data for the Contact page
loadContactPageData();

// loads the data for the Contact page
function loadContactPageData() {
    var app = angular.module('contactApp', []);
    app.controller('contactController', function ($scope, $http) {
        $http.get('/external-files/data/contact.json').success(function (data) {
            $scope.contact = data;
        });
    });
}