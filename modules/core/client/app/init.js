'use strict';

// start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// configure the module
angular.module(ApplicationConfiguration.applicationModuleName).config(['$routeProvider', '$locationProvider', '$httpProvider', '$compileProvider', '$logProvider', 'cfpLoadingBarProvider', 'ChartJsProvider', function ($routeProvider, $locationProvider, $httpProvider, $compileProvider, $logProvider, cfpLoadingBarProvider, ChartJsProvider, $routeParams) {
    // check browser support to enable html 5
    if (window.history && window.history.pushState) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: true
        });
    }
    else {
        // remove default "!" in has prefix
        $locationProvider.hashPrefix('');

        // remove index.html
        $locationProvider.hashPrefix();
    }

    // set some header defaults
    $httpProvider.defaults.headers.common['Access-Control-Max-Age'] = '600';
    $httpProvider.defaults.headers.common['Accept'] = 'application/json; odata=verbose';
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; odata=verbose';

    // disable debug data for production environment
    // @link https://docs.angularjs.org/guide/production
    $compileProvider.debugInfoEnabled(ApplicationConfiguration.applicationEnvironment !== 'production' && ApplicationConfiguration.applicationEnvironment !== 'developmentp');
    $compileProvider.commentDirectivesEnabled(ApplicationConfiguration.applicationEnvironment !== 'production' && ApplicationConfiguration.applicationEnvironment !== 'developmentp');
    $compileProvider.cssClassDirectivesEnabled(ApplicationConfiguration.applicationEnvironment !== 'production' && ApplicationConfiguration.applicationEnvironment !== 'developmentp');
    $logProvider.debugEnabled(ApplicationConfiguration.applicationEnvironment !== 'production' && ApplicationConfiguration.applicationEnvironment !== 'developmentp');

    // turn off spinner
    cfpLoadingBarProvider.includeSpinner = false;

    // set parent element to attached to
    cfpLoadingBarProvider.parentSelector = '#main';

    // set the default colors
    ChartJsProvider.setOptions({ colors : [ApplicationConfiguration.applicationThemeOne, '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });
}]);

// configure the route
angular.module(ApplicationConfiguration.applicationModuleName).run(['$rootScope', '$location', 'LoginFactory', function($rootScope, $location, LoginFactory) {
    // on a route change (the start of a route change)
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        // check to see if user is logged in
        LoginFactory.isUserLoggedIn().then(function(response) {
            // determines if user is logged in
            $rootScope.$root.isLoggedIn = response.isLoggedIn;

            // if the next route needs authentication
            if (next.$$route && next.$$route.authenticated) {
                // if user is not logged in
                if (!$rootScope.$root.isLoggedIn) {
                    // prevent the default route
                    //event.preventDefault();

                    // redirect to 401
                    //$location.path('/not-authorized');

                    // TODO: insert next template and controller instead
                    // use next.$route.templateUrl or something

                    //next.loadedTemplateUrl = '/modules/core/client/views/error.client.view.html';
                    //next.$$route.controller = 'ErrorController';
                    //next.$$route.templateUrl = '/modules/core/client/views/error.client.view.html';
                }
            }
        });
    })
}]);

// define the init function for starting up the application
angular.element(document).ready(init);

// initialize the application
function init() {
    // initialize the application
    angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
};