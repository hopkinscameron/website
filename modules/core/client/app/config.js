'use strict';

// the application module name
const applicationModuleName = 'personalsite';

// the application name
const applicationName = 'Cameron Hopkins';

// the service for the application
var service = {
    applicationName: applicationName,
    applicationEnvironment: window.env,
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: ['ngRoute', 'ngSanitize', 'ngAnimate', 'angular-loading-bar', 'ngDialog',  'ui.tinymce'],
    registerModule: registerModule
};

// set the application configuration
window.ApplicationConfiguration = service;

// add a new vertical module
function registerModule(moduleName, dependencies) {
    // create angular module
    angular.module(moduleName, dependencies || []);

    // add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
};