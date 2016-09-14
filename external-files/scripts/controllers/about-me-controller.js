
// load the data for the About Me page
loadAboutMePageData();

// loads the data for the About Me page
function loadAboutMePageData() {
    var app = angular.module('aboutMeApp', []);
    app.controller('aboutMeController', function ($scope, $http) {
        $http.get('/external-files/data/about-me.json').success(function (data) {
            $scope.aboutme = data;
        });
    });
}