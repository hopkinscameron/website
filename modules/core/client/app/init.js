'use strict';

// start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// configure the module
angular.module(ApplicationConfiguration.applicationModuleName).config(['$routeProvider', '$locationProvider', '$httpProvider', '$compileProvider', '$logProvider', 'cfpLoadingBarProvider', function ($routeProvider, $locationProvider, $httpProvider, $compileProvider, $logProvider, cfpLoadingBarProvider, $routeParams) {
    // remove default "!" in has prefix
    $locationProvider.hashPrefix('');

    // remove index.html
    $locationProvider.hashPrefix();

    // check browser support
    if (window.history && window.history.pushState) {
        /*
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        }).hashPrefix('!');*/
    }

    // set some header defaults
    $httpProvider.defaults.headers.common['Access-Control-Max-Age'] = '600';
    $httpProvider.defaults.headers.common['Accept'] = 'application/json; odata=verbose';
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; odata=verbose';

    // disable debug data for production environment
    // @link https://docs.angularjs.org/guide/production
    $compileProvider.debugInfoEnabled(ApplicationConfiguration.applicationEnvironment !== 'production');
    $logProvider.debugEnabled(ApplicationConfiguration.applicationEnvironment !== 'production');

    // turn off spinner
    cfpLoadingBarProvider.includeSpinner = false;

    // set parent element to attached to
    cfpLoadingBarProvider.parentSelector = '#main';
}]);

// define the init function for starting up the application
angular.element(document).ready(init);

// initialize the application
function init() {
    // initialize the application
    angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
};