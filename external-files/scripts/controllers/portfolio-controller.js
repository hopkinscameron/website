
// load the data for the Portfolio page
loadPortfolioPageData();

// loads the data for the Portfolio page
function loadPortfolioPageData() {
    var app = angular.module('portfolioApp', []);
    app.controller('portfolioController', function ($scope, $http) {
        $http.get('/external-files/data/portfolio.json').success(function (data) {
            $scope.portfolio = data;
        });
        $scope.getPictureTitle = function (pictureLink) {
            //split string
            var splits = pictureLink.split('/');
            return splits[splits.length - 1];
        };
    });
}