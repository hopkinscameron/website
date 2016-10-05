
window.angular.module('emojis').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    'use strict';

    $urlRouterProvider.otherwise('/home');
    //
    // Now set up the states
    $stateProvider
    	.state('home', {
            url: '/home',
            templateUrl: 'templates/home.html'
        })
        .state('eventId', {
            url: '/events/:id',
            templateUrl: 'templates/event.html'
        })
        .state('events', {
            url: '/events',
            templateUrl: 'templates/events.html'
        })
        .state('lights', {
            url: '/lights',
            templateUrl: 'templates/lights.html'
        })
        .state('groups', {
            url: '/groups',
            templateUrl: 'templates/groups.html'
        })
        .state('groupDetails', {
            url: '/groups/:id',
            templateUrl: 'templates/group-details.html'
        })
        .state('settings', {
            url: '/settings',
            cache: true,
            templateUrl: 'templates/settings.html'
        })
        .state('calendar', {
            url: '/calendar',
            templateUrl: 'templates/calendar.html'
        })
        .state('admin', {
            url: '/admin',
            templateUrl: 'templates/admin.html'
        })
}]);
