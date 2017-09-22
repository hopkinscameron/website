'use strict';

// the application module name
// FIXME: had this as "const" is there a way to keep this during minification
var applicationModuleName = 'personalsite';

// the application name
// FIXME: had this as "const" is there a way to keep this during minification
var applicationName = 'Cameron Hopkins';

// the application base
// FIXME: had this as "const" is there a way to keep this during minification
var applicationBase = '/';

// the application theme one
// FIXME: had this as "const" is there a way to keep this during minification
var applicationThemeOne = '#29a8d6';

// the service for the application
var service = {
    applicationBase: applicationBase,
    applicationName: applicationName,
    applicationEnvironment: window.env,
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: ['ngRoute', 'ngSanitize', 'ngAnimate', 'angular-loading-bar', 'ngDialog', 'ui.tinymce', 'chart.js'],
    registerModule: registerModule,
    applicationThemeOne: applicationThemeOne
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