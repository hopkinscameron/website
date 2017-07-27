angular.module('app').controller('ErrorController', ['$scope', '$compile', 'Service', function ($scope, $compile, Service) {
    // initialize
    $scope.pageTitle = 'Page not found' + " | " + Service.appName;
    $scope.status = 404; 
    $scope.message = 'The page you are looking for does not exist'; 

    // setup page
    setUpPage();

    // initialization of controller
    $scope.init = function(title, status, message)
    {
        // initialize
        $scope.pageTitle = title + " | " + Service.appName;
        $scope.status = status; 
        $scope.message = message; 

        // get correct error code
        switch(status) {
            case 400:
                $scope.image = '/images/errors/400.png';
                break;
            case 401:
                $scope.image = '/images/errors/401.png';
                break;
            case 403:
                $scope.image = '/images/errors/403.png';
                break;
            case 404:
                $scope.image = '/images/errors/404.png';
                break;
            case 500:
                $scope.image = '/images/errors/500.png';
                break;
            default:
                $scope.image = '/images/errors/404.png';
        }

        // setup page
        setUpPage();
    };

    // on the destruction of the controller
    $scope.$on("$destroy", function handler() {
        // get body
        var body = angular.element(document.body);

        // if correct css, remove it
        if(body && body.hasClass('body-error')) {
            body.removeClass('body-error');
        }
    });
    
    // sets up the page
    function setUpPage() {
        // set up the title
        var titleDOM = document.getElementById("pageTitle");
        var title = "\'" + $scope.pageTitle + "\'";
        titleDOM.setAttribute("ng-bind-html", title);
        $compile(titleDOM)($scope);

        // get body
        var body = angular.element(document.body);

        // if not correct css, add it
        if(body && !body.hasClass('body-error')) {
            body.addClass('body-error');
        }
    };
}]);