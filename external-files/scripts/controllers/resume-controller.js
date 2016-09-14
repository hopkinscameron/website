
// load the data for the Resume page
loadResumePageData();

// loads the data for the Resume page
function loadResumePageData() {
    var app = angular.module('resumeApp', []).filter('trustUrl', function ($sce) {
        return function (url) {
            return $sce.trustAsResourceUrl(url);
        };
    }).filter('trustHTML', function ($sce) {
        return function (html) {
            return $sce.trustAsHtml(html);
        };
    });

    app.controller('resumeController', function ($scope, $http) {
        $http.get('/external-files/data/resume.json').success(function (data) {
            $scope.resume = data;
        });
    });
}