'use strict';

// set up the module
var coreModule = angular.module('core');

// creates a directive for loading a spinner in place of an image
coreModule.directive('spinnerLoad', [function spinnerLoad() {
    return {
        restrict: 'A',
        link: function spinnerLoadLink(scope, elem, attrs) {
            scope.$watch('ngSrc', function watchNgSrc() {
                elem.hide();
                elem.after('<i class="fa fa-spinner fa-lg fa-spin"></i>');  // add spinner
            });
            elem.on('load', function onLoad() {
                elem.show();
                elem.next('i.fa-spinner').remove(); // remove spinner
            });
        }
    };
}]);