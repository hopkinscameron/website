'use strict';

// set up the module
var dashboardModule = angular.module('dashboard');

// create the controller
dashboardModule.controller('DashboardController', ['$scope', '$rootScope', '$compile', '$location', '$window', '$timeout', 'ChartJs', 'Service', 'DashboardFactory', function ($scope, $rootScope, $compile, $location, $window, $timeout, ChartJs, Service, DashboardFactory) {
    // determines if a page has already sent a request for load
    var pageRequested = false;

    // set jQuery
    $ = window.jQuery;

    // set the path
    Service.afterPath = $location.path();

    // holds the error
    $scope.error = {
        'error': false,
        'title': '',
        'status': 404,
        'message': ''
    };

    // the initial text of a dropdown
    var initialText = 'Select One';

    // the request options
    $scope.requestOptions = {
        'selected': initialText,
        'options': [initialText]
    };

    // set the first option
    $scope.requestOptions.selected = $scope.requestOptions.options[0];    

    // the number of months to show history on
    $scope.monthOptions = {
        'selected': initialText,
        'options': [initialText, '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    };

    // set the first option
    $scope.monthOptions.selected = $scope.monthOptions.options[0];

    // determines if the page is fully loaded
    $scope.pageFullyLoaded = false;

    // check if header/footer was initialized
    if($rootScope.$root.showHeader === undefined || $rootScope.$root.showFooter === undefined) {
        // refresh header
        $rootScope.$emit('refreshHeader', {});

        // refresh footer
        $rootScope.$emit('refreshFooter', {});
    }
    else {
        // always refresh header to ensure login
        $rootScope.$emit('refreshHeader', {});
    }

    // on header refresh
    $rootScope.$on('headerRefreshed', function (event, data) {
        // if footer still hasn't been initialized
        if($rootScope.$root.showFooter === undefined) {
            // refresh footer
            $rootScope.$emit('refreshFooter', {});
        }
        else {
            // initialize the page
            initializePage();
        }
    });

    // on footer refresh
    $rootScope.$on('footerRefreshed', function (event, data) {
        // if footer still hasn't been initialized
        if($rootScope.$root.showHeader === undefined) {
            // refresh header
            $rootScope.$emit('refreshHeader', {});
        }
        else {
            // initialize the page
            initializePage();
        }
    });

    // update the graph based on new data
    $scope.updateGraph = function () {
        // update the graph
        updateAnalyticsGraph();
    };

    // initialize page
    function initializePage() {
        // show the header if not shown     
        if (!$rootScope.$root.showHeader) {
            $rootScope.$root.showHeader = true;
        }

        // show the footer if not shown
        if (!$rootScope.$root.showFooter) {
            $rootScope.$root.showFooter = true;
        }

        // if page hasn't been requested yet
        if(!pageRequested) {
            // set page has been requested
            pageRequested = true;

            // show the page after a timeout
            $timeout(getPageData, $rootScope.$root.getPageDataTimeout);
        }
    };

    // gets the page data
    function getPageData() {
        // get dashboard me page data
        DashboardFactory.getDashboardPageInformation().then(function (responseD) {
            // if returned a valid response
            if (!responseD.error) {
                // set the data
                $scope.dashboard = {};
                $scope.dashboard.requests = responseD;
                $scope.dashboard.title = 'Dashboard';

                // add all requests
                _.forEach($scope.dashboard.requests, function(value) {
                    $scope.requestOptions.options.push(value.request);
                });

                // the initial delayed start time of any animation
                var startTime = 1.5;

                // the incremental start time of every animation (every animation in the array has a value greater than the last by this much)
                var incrementTime = 1;

                // holds the animation times
                $scope.dashboardAnimations = $rootScope.$root.getAnimationDelays(startTime, incrementTime, 2);

                // holds the page title
                $scope.pageTitle = 'Dashboard | ' + ApplicationConfiguration.applicationName;
                
                // setup page
                setUpPage();
            }
            else {
                // set error
                $scope.pageTitle = responseD.title;
                $scope.error.error = true;
                $scope.error.title = responseD.title;
                $scope.error.status = responseD.status;
                $scope.error.message = responseD.message;

                // setup page
                setUpPage();
            }
        })
        .catch(function (responseD) {
            // set error
            $scope.pageTitle = responseD.title;
            $scope.error.error = true;
            $scope.error.title = responseD.title;
            $scope.error.status = responseD.status;
            $scope.error.message = responseD.message;

            // setup page
            setUpPage();
        });
    };

    // sets up the page
    function setUpPage() {
        // set up the title
        var titleDOM = document.getElementById('pageTitle');
        var title = '\'' + $scope.pageTitle + '\'';
        titleDOM.setAttribute('ng-bind-html', title);
        $compile(titleDOM)($scope);

        // set page fully loaded
        $scope.pageFullyLoaded = true;

        // show the page after a timeout
        $timeout(showPage, $rootScope.$root.showPageTimeout);
    };

    // shows the page
    function showPage() {
        // check if collapsing is already occuring
        if(!angular.element('#pageShow').hasClass('collapsing')) {
            // show the page
            angular.element('#pageShow').collapse('show');
        }
    };

    // updates the graph based on selection
    function updateAnalyticsGraph() {
        // check if both selected
        if($scope.requestOptions.selected != initialText && $scope.monthOptions.selected != initialText) {
            // destroy chart before building a new one
            clearChart('requestAnalyticsCanvas');

            // set the new data
            $scope.requestAnalyticsData = setUpData();
            $scope.requestAnalyticsLabels = setUpLabels();
            $scope.requestAnalyticsOptions = setUpOptions($scope.requestAnalyticsData);
            $scope.requestAnalyticsSeries = ['Request Analytics'];
        }
        else {
            // clear the graph
            clearChart('requestAnalyticsCanvas');
            $scope.requestAnalyticsOptions = [];
            $scope.requestAnalyticsData = [];
            $scope.requestAnalyticsLabels = [];
            $scope.requestAnalyticsSeries = [];
        }
    };

    // clears the chart
    function clearChart(chartId) {
        // get the canvas
        var ctx = document.getElementById(chartId);

        // if found
        if(ctx) {
            // get all chart instances
            var charts = ChartJs.Chart.instances; 

            // https://stackoverflow.com/questions/30349224/how-to-clear-the-data-for-a-angular-chart
            _.forEach(charts, function(key) {
                if (!charts.hasOwnProperty(key)){
                    return;
                }
                var chartAux = ChartJs.Chart.instances[key]; 
                if (chartAux.chart.ctx.canvas.id === elementId){ 
                    // remove chart-legend before destroying the chart
                    var parent = chartAux.chart.ctx.canvas.parentElement;
                    var legend = chartAux.chart.ctx.canvas.nextElementSibling;
                    parent.removeChild(legend);

                    // compare id with elementId passed by and if it is the one            
                    // you want to remove just call the destroy function
                    ChartJs.Chart.instances[key].destroy(); 
                }
            });
        }
    };

    // sets up the data for the graph
    function setUpData() {
        // initialize the data
        var requestAnalyticsData = [];

        // add all requests
        _.forEach($scope.dashboard.requests, function(request) {
            // if request matches
            if(request.request == $scope.requestOptions.selected) {
                // go through all months and push the count
                _.forEach(_.keys(request.byMonth), function(monthYear) {
                    var count = request.byMonth[monthYear].length;
                    requestAnalyticsData.push(count);
                });
            }
        });

        return requestAnalyticsData;
    };

    // sets up the labels for the graph
    function setUpLabels() {
        // initialize the labels
        var requestAnalyticsLabels = [];

        // add all requests
        _.forEach($scope.dashboard.requests, function(request) {
            // if request matches
            if(request.request == $scope.requestOptions.selected) {
                // go through all months and push the count
                _.forEach(_.keys(request.byMonth), function(monthYear) {
                    requestAnalyticsLabels.push(monthYear);
                });
            }
        });

        return requestAnalyticsLabels;
    };

    // sets up the options for the graph
    function setUpOptions(data) {
        // the max and min value from data
        var maxValue = 0;
        var minValue = 0;
        var adjustValue = 5;

        // add all requests
        _.forEach(data, function(value) {
            // if there is a higher value
            maxValue = value > maxValue ? value : maxValue;

            // if there is a lower value
            minValue = value < minValue ? value : minValue;
        });

        // if there is a lower min value than zero, adjust
        minValue = minValue < 0 ? (minValue - adjustValue) : minValue;
        maxValue += adjustValue;

        // set up the options
        var requestAnalyticsOptions = {
            tooltips: {
                mode: 'x'
            },
            scaleShowLabels: true,
            scales: {
                yAxes: [
                  {
                      type: 'linear',
                      display: true,
                      position: 'left',
                      ticks: {
                          suggestedMin: minValue,
                          suggestedMax: maxValue,
                          fontSize: 15,
                          fontColor: ApplicationConfiguration.applicationThemeOne
                      },
                      scaleLabel: {
                          display: true,
                          labelString: 'Number of Requests',
                          fontSize: 20,
                          fontColor: 'white'
                      }
                  }
                ],
                xAxes: [
                    {
                        ticks: {
                            autoSkip: false,
                            fontSize: 15,
                            fontColor: ApplicationConfiguration.applicationThemeOne
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Date Range',
                            fontSize: 20,
                            fontColor: 'white'
                        }
                    }
                ],

            },
            gridlines: { count: 1 }
        };

        return requestAnalyticsOptions;
    };
}]);