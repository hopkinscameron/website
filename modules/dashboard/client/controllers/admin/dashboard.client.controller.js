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
    $scope.initialText = 'Select One';

    // the request options
    $scope.requestOptions = {
        'selected': $scope.initialText,
        'options': [$scope.initialText]
    };

    // set the first option
    $scope.requestOptions.selected = $scope.requestOptions.options[0];    

    // the view to show history on
    $scope.viewOptions = {
        'selected': $scope.initialText,
        'options': [$scope.initialText, 'Years', 'Months', 'Weeks', 'Days']
    };

    // set the first option
    $scope.viewOptions.selected = $scope.viewOptions.options[0];

    // the number of past options to show history on
    $scope.pastOptions = {};

    // the number of years to show history on
    var yearsOptions = {
        'selected': $scope.initialText,
        'options': [$scope.initialText, '0', '1', '2', '3']
    };

    // the number of months to show history on
    var monthsOptions = {
        'selected': $scope.initialText,
        'options': [$scope.initialText, '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    };

    // the number of weeks to show history on
    var weeksOptions = {
        'selected': $scope.initialText,
        'options': [$scope.initialText, '0', '1', '2', '3', '4']
    };

    // the number of days to show history on
    var daysOptions = {
        'selected': $scope.initialText,
        'options': [$scope.initialText, '0', '1', '2', '3', '4', '5', '6', '7']
    };

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
        // if the years option was selected
        if($scope.requestOptions.selected != $scope.initialText && $scope.viewOptions.selected == 'Years') {
            // if option was already selected
            if($scope.pastOptions == yearsOptions) {
                // update based on years
                updateAnalyticsGraphBasedOnYears();
            }
            else {
                // set the new selected
                $scope.pastOptions = yearsOptions;
                $scope.pastOptions.selected = $scope.pastOptions.options[0];
            }
        }
        // if the months option was selected
        else if($scope.requestOptions.selected != $scope.initialText && $scope.viewOptions.selected == 'Months') {
            // if option was already selected
            if($scope.pastOptions == monthsOptions) {
                // update based on months
                updateAnalyticsGraphBasedOnMonths();
            }
            else {
                // set the new selected
                $scope.pastOptions = monthsOptions;
                $scope.pastOptions.selected = $scope.pastOptions.options[0];
            }
        }
        // if the weeks option was selected
        else if($scope.requestOptions.selected != $scope.initialText && $scope.viewOptions.selected == 'Weeks') {
            // if option was already selected
            if($scope.pastOptions == weeksOptions) {
                // update based on weeks
                updateAnalyticsGraphBasedOnWeeks();
            }
            else {
                // set the new selected
                $scope.pastOptions = weeksOptions;
                $scope.pastOptions.selected = $scope.pastOptions.options[0];
            }
        }
        // if the days option was selected
        else if($scope.requestOptions.selected != $scope.initialText && $scope.viewOptions.selected == 'Days') {
            // if option was already selected
            if($scope.pastOptions == daysOptions) {
                // update based on days
                updateAnalyticsGraphBasedOnDays();
            }
            else {
                // set the new selected
                $scope.pastOptions = daysOptions;
                $scope.pastOptions.selected = $scope.pastOptions.options[0];
            }
        }
        else {
            // clear the graph
            clearChart('requestAnalyticsCanvas');
            $scope.viewOptions.selected = $scope.viewOptions.options[0];
            $scope.pastOptions = {};
            $scope.requestAnalyticsOptions = [];
            $scope.requestAnalyticsData = [];
            $scope.requestAnalyticsLabels = [];
            $scope.requestAnalyticsSeries = [];
        }
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

    // updates the graph based on years
    function updateAnalyticsGraphBasedOnYears() {
        // check if all is selected
        if($scope.requestOptions.selected != $scope.initialText && $scope.viewOptions.selected != $scope.initialText && $scope.pastOptions.selected != $scope.initialText) {
            // destroy chart before building a new one
            clearChart('requestAnalyticsCanvas');

            // get the beginning of current year and the furthest date back
            var date = new Date();
            var endingOfYear = new Date(date.getFullYear(), 11, 31);
            var beginningOfYear = new Date(date.getFullYear(), 0, 1);
            var furthestDateBack = new Date(beginningOfYear);
            furthestDateBack.setFullYear(furthestDateBack.getFullYear() - parseInt($scope.pastOptions.selected));

            // set the new data
            $scope.requestAnalyticsData = setUpDataBasedOnYears(furthestDateBack, endingOfYear);
            $scope.requestAnalyticsLabels = setUpLabelsBasedOnYears(furthestDateBack, endingOfYear);
            $scope.requestAnalyticsOptions = setUpOptions($scope.requestAnalyticsData);
            $scope.requestAnalyticsSeries = ['Request Analytics'];
        }
        else {
            // clear the graph
            clearChart('requestAnalyticsCanvas');
            $scope.viewOptions.selected = $scope.viewOptions.options[0];
            $scope.pastOptions = {};
            $scope.requestAnalyticsOptions = [];
            $scope.requestAnalyticsData = [];
            $scope.requestAnalyticsLabels = [];
            $scope.requestAnalyticsSeries = [];
        }
    };

    // updates the graph based on months
    function updateAnalyticsGraphBasedOnMonths() {
        // check if all is selected
        if($scope.requestOptions.selected != $scope.initialText && $scope.viewOptions.selected != $scope.initialText && $scope.pastOptions.selected != $scope.initialText) {
            // destroy chart before building a new one
            clearChart('requestAnalyticsCanvas');

            // get the beginning of current month and the furthest date back
            var date = new Date();
            var beginningOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            var furthestDateBack = new Date(beginningOfMonth);
            furthestDateBack.setMonth(furthestDateBack.getMonth() - parseInt($scope.pastOptions.selected));

            // set the new data
            $scope.requestAnalyticsData = setUpDataBasedOnMonths(furthestDateBack, beginningOfMonth);
            $scope.requestAnalyticsLabels = setUpLabelsBasedOnMonths(furthestDateBack, beginningOfMonth);
            $scope.requestAnalyticsOptions = setUpOptions($scope.requestAnalyticsData);
            $scope.requestAnalyticsSeries = ['Request Analytics'];
        }
        else {
            // clear the graph
            clearChart('requestAnalyticsCanvas');
            $scope.viewOptions.selected = $scope.viewOptions.options[0];
            $scope.pastOptions = {};
            $scope.requestAnalyticsOptions = [];
            $scope.requestAnalyticsData = [];
            $scope.requestAnalyticsLabels = [];
            $scope.requestAnalyticsSeries = [];
        }
    };

    // updates the graph based on weeks
    function updateAnalyticsGraphBasedOnWeeks() {
        // check if all is selected
        if($scope.requestOptions.selected != $scope.initialText && $scope.viewOptions.selected != $scope.initialText && $scope.pastOptions.selected != $scope.initialText) {
            // destroy chart before building a new one
            clearChart('requestAnalyticsCanvas');

            // get the furthest date back by weeks
            var today = new Date();
            var furthestDateBack = new Date(today);
            furthestDateBack.setDate(furthestDateBack.getDate() - (parseInt($scope.pastOptions.selected) * 7));

            // set the new data
            $scope.requestAnalyticsData = setUpDataBasedOnWeeks(furthestDateBack, today);
            $scope.requestAnalyticsLabels = setUpLabelsBasedOnWeeks(furthestDateBack, today);
            $scope.requestAnalyticsOptions = setUpOptions($scope.requestAnalyticsData);
            $scope.requestAnalyticsSeries = ['Request Analytics'];
        }
        else {
            // clear the graph
            clearChart('requestAnalyticsCanvas');
            $scope.viewOptions.selected = $scope.viewOptions.options[0];
            $scope.pastOptions = {};
            $scope.requestAnalyticsOptions = [];
            $scope.requestAnalyticsData = [];
            $scope.requestAnalyticsLabels = [];
            $scope.requestAnalyticsSeries = [];
        }
    };

    // updates the graph based on days
    function updateAnalyticsGraphBasedOnDays() {
        // check if all is selected
        if($scope.requestOptions.selected != $scope.initialText && $scope.viewOptions.selected != $scope.initialText && $scope.pastOptions.selected != $scope.initialText) {
            // destroy chart before building a new one
            clearChart('requestAnalyticsCanvas');

            // get the furthest date back by days
            var today = new Date();
            var furthestDateBack = new Date(today);
            furthestDateBack.setDate(furthestDateBack.getDate() - parseInt($scope.pastOptions.selected));

            // set the new data
            $scope.requestAnalyticsData = setUpDataBasedOnDays(furthestDateBack, today);
            $scope.requestAnalyticsLabels = setUpLabelsBasedOnDays(furthestDateBack, today);
            $scope.requestAnalyticsOptions = setUpOptions($scope.requestAnalyticsData);
            $scope.requestAnalyticsSeries = ['Request Analytics'];
        }
        else {
            // clear the graph
            clearChart('requestAnalyticsCanvas');
            $scope.viewOptions.selected = $scope.viewOptions.options[0];
            $scope.pastOptions = {};
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

    // sets up the data for the graph based on years
    function setUpDataBasedOnYears(furthestDateBack, today) {
        // initialize the data
        var requestAnalyticsData = [];

        // the inital start data from the data
        var initialStartDate = new Date(furthestDateBack);

        // add all requests
        _.forEach($scope.dashboard.requests, function(request) {
            // if request matches
            if(request.request == $scope.requestOptions.selected) {
                // go through all years and push the count
                _.forEach(_.keys(request.byYear), function(year) {
                    // get this objects date
                    var thisDate = new Date(year);

                    // if this year is within range
                    if(thisDate >= furthestDateBack && thisDate <= today) {
                        // if the dates don't match
                        while(initialStartDate < thisDate) {
                            // add this year (with a zero input)
                            requestAnalyticsData.push(0);

                            // set expected next year
                            initialStartDate.setFullYear(initialStartDate.getFullYear() + 1);
                        }

                        // add the count
                        requestAnalyticsData.push(request.byYear[year].length);

                        // set expected next year
                        initialStartDate.setFullYear(initialStartDate.getFullYear() + 1);
                    }
                });
            }
        });

        return requestAnalyticsData;
    };

    // sets up the data for the graph based on months
    function setUpDataBasedOnMonths(furthestDateBack, today) {
        // initialize the data
        var requestAnalyticsData = [];

        // the inital start data from the data
        var initialStartDate = new Date(furthestDateBack);

        // add all requests
        _.forEach($scope.dashboard.requests, function(request) {
            // if request matches
            if(request.request == $scope.requestOptions.selected) {
                // go through all months and push the count
                _.forEach(_.keys(request.byMonth), function(monthYear) {
                    // get this objects date
                    var thisDate = new Date(monthYear);

                    // if this month is within range
                    if(thisDate >= furthestDateBack && thisDate <= today) {
                        // if the dates don't match
                        while(initialStartDate < thisDate) {
                            // add this month (with a zero input)
                            requestAnalyticsData.push(0);

                            // set expected next month
                            initialStartDate.setMonth(initialStartDate.getMonth() + 1);
                        }

                        // add the count
                        requestAnalyticsData.push(request.byMonth[monthYear].length);

                        // set expected next month
                        initialStartDate.setMonth(initialStartDate.getMonth() + 1);
                    }
                });
            }
        });

        return requestAnalyticsData;
    };

    // sets up the data for the graph based on weeks
    function setUpDataBasedOnWeeks(furthestDateBack, today) {
        // initialize the data
        var requestAnalyticsData = [];

        // the inital start data from the data
        var initialStartDate = new Date(furthestDateBack);

        // add all requests
        _.forEach($scope.dashboard.requests, function(request) {
            // if request matches
            if(request.request == $scope.requestOptions.selected) {
                // go through all weeks and push the count
                _.forEach(_.keys(request.byWeek), function(week) {
                    // get this objects date
                    var thisDate = new Date(week);

                    // if this week is within range
                    if(thisDate >= furthestDateBack && thisDate <= today) {
                        // if the dates don't match
                        while(initialStartDate < thisDate) {
                            // add this week (with a zero input)
                            requestAnalyticsData.push(0);

                            // set expected next week
                            initialStartDate.setDate(initialStartDate.getDate() + 7);
                        }

                        // add the count
                        requestAnalyticsData.push(request.byWeek[week].length);

                        // set expected next week
                        initialStartDate.setDate(initialStartDate.getDate() + 7);
                    }
                });
            }
        });

        return requestAnalyticsData;
    };

    // sets up the data for the graph based on days
    function setUpDataBasedOnDays(furthestDateBack, today) {
        // initialize the data
        var requestAnalyticsData = [];

        // the inital start data from the data
        var initialStartDate = new Date(furthestDateBack);

        // add all requests
        _.forEach($scope.dashboard.requests, function(request) {
            // if request matches
            if(request.request == $scope.requestOptions.selected) {
                // go through all days and push the count
                _.forEach(_.keys(request.byDay), function(day) {
                    // get this objects date
                    var thisDate = new Date(day);

                    // if this day is within range
                    if(thisDate >= furthestDateBack && thisDate <= today) {
                        // if the dates don't match
                        while(initialStartDate < thisDate) {
                            // add this day (with a zero input)
                            requestAnalyticsData.push(0);

                            // set expected next day
                            initialStartDate.setDate(initialStartDate.getDate() + 1);
                        }

                        // add the count
                        requestAnalyticsData.push(request.byDay[day].length);

                        // set expected next day
                        initialStartDate.setDate(initialStartDate.getDate() + 1);
                    }
                });
            }
        });

        return requestAnalyticsData;
    };

    // sets up the labels for the graph based on years
    function setUpLabelsBasedOnYears(furthestDateBack, today) {
        // initialize the labels
        var requestAnalyticsLabels = [];

        // the inital start data from the data
        var initialStartDate = new Date(furthestDateBack);

        // add all requests
        _.forEach($scope.dashboard.requests, function(request) {
            // if request matches
            if(request.request == $scope.requestOptions.selected) {
                // go through all years and push the count
                _.forEach(_.keys(request.byYear), function(year) {
                    // get this objects date
                    var thisDate = new Date(year);

                    // if this year is within range
                    if(thisDate >= furthestDateBack && thisDate <= today) {
                        // if the dates don't match
                        while(initialStartDate < thisDate) {
                            // add this year
                            requestAnalyticsLabels.push(initialStartDate.getFullYear());

                            // set expected next year
                            initialStartDate.setFullYear(initialStartDate.getFullYear() + 1);
                        }

                        // add the year
                        requestAnalyticsLabels.push(year.substring(4));

                        // set expected next year
                        initialStartDate.setFullYear(initialStartDate.getFullYear() + 1);
                    }
                });
            }
        });

        return requestAnalyticsLabels;
    };

    // sets up the labels for the graph based on months
    function setUpLabelsBasedOnMonths(furthestDateBack, today) {
        // initialize the labels
        var requestAnalyticsLabels = [];

        // the inital start data from the data
        var initialStartDate = new Date(furthestDateBack);

        // add all requests
        _.forEach($scope.dashboard.requests, function(request) {
            // if request matches
            if(request.request == $scope.requestOptions.selected) {
                // go through all months and push the count
                _.forEach(_.keys(request.byMonth), function(monthYear) {
                    // get this objects date
                    var thisDate = new Date(monthYear);

                    // if this month is within range
                    if(thisDate >= furthestDateBack && thisDate <= today) {
                        // if the dates don't match
                        while(initialStartDate < thisDate) {
                            // add this month
                            var nextMonth = initialStartDate.toLocaleString('en-us', { month: 'short' });
                            var nextMonthYear = nextMonth.concat(' ', initialStartDate.getFullYear());
                            requestAnalyticsLabels.push(nextMonthYear);

                            // set expected next month
                            initialStartDate.setMonth(initialStartDate.getMonth() + 1);
                        }

                        // add the month and year
                        requestAnalyticsLabels.push(monthYear);

                        // set expected next month
                        initialStartDate.setMonth(initialStartDate.getMonth() + 1);
                    }
                });
            }
        });

        return requestAnalyticsLabels;
    };

    // sets up the labels for the graph based on weeks
    function setUpLabelsBasedOnWeeks(furthestDateBack, today) {
        // initialize the labels
        var requestAnalyticsLabels = [];

        // the inital start data from the data
        var initialStartDate = new Date(furthestDateBack);

        // add all requests
        _.forEach($scope.dashboard.requests, function(request) {
            // if request matches
            if(request.request == $scope.requestOptions.selected) {
                // go through all months and push the count
                _.forEach(_.keys(request.byMonth), function(monthYear) {
                    // get this objects date
                    var thisDate = new Date(monthYear);

                    // if this month is within range
                    if(thisDate >= furthestDateBack && thisDate <= today) {
                        // if the dates don't match
                        while(initialStartDate < thisDate) {
                            // add this month
                            var nextMonth = initialStartDate.toLocaleString('en-us', { month: 'short' });
                            var nextMonthYear = nextMonth.concat(' ', initialStartDate.getFullYear());
                            requestAnalyticsLabels.push(nextMonthYear);

                            // set expected next month
                            initialStartDate.setMonth(initialStartDate.getMonth() + 1);
                        }

                        // add the month and year
                        requestAnalyticsLabels.push(monthYear);

                        // set expected next month
                        initialStartDate.setMonth(initialStartDate.getMonth() + 1);
                    }
                });
            }
        });

        return requestAnalyticsLabels;
    };

    // sets up the labels for the graph based on days
    function setUpLabelsBasedOnDays(furthestDateBack, today) {
        // initialize the labels
        var requestAnalyticsLabels = [];

        // the inital start data from the data
        var initialStartDate = new Date(furthestDateBack);

        // add all requests
        _.forEach($scope.dashboard.requests, function(request) {
            // if request matches
            if(request.request == $scope.requestOptions.selected) {
                // go through all months and push the count
                _.forEach(_.keys(request.byMonth), function(monthYear) {
                    // get this objects date
                    var thisDate = new Date(monthYear);

                    // if this month is within range
                    if(thisDate >= furthestDateBack && thisDate <= today) {
                        // if the dates don't match
                        while(initialStartDate < thisDate) {
                            // add this month
                            var nextMonth = initialStartDate.toLocaleString('en-us', { month: 'short' });
                            var nextMonthYear = nextMonth.concat(' ', initialStartDate.getFullYear());
                            requestAnalyticsLabels.push(nextMonthYear);

                            // set expected next month
                            initialStartDate.setMonth(initialStartDate.getMonth() + 1);
                        }

                        // add the month and year
                        requestAnalyticsLabels.push(monthYear);

                        // set expected next month
                        initialStartDate.setMonth(initialStartDate.getMonth() + 1);
                    }
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