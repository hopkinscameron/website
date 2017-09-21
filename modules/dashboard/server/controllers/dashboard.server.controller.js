'use strict';

/**
 * Module dependencies
 */
var // the path
    path = require('path'),
    // the error handler
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    // chalk for console logging
    clc = require(path.resolve('./config/lib/clc')),
    // lodash
    _ = require('lodash'),
    // the Analytics Page model
    AnalyticsPage = require(path.resolve('./modules/dashboard/server/models/model-analytics-page'));

/**
 * Show the current page
 */
exports.read = function (req, res) {
    // find all
	AnalyticsPage.find({ }, function(err, foundPages) {
		// if error occurred
		if (err) {
			// send internal error
            res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err) });
            console.log(clc.error(errorHandler.getDetailedErrorMessage(err)));
        }
        else {
            // get the sorted pages
            var sortedPages = sortPagesByDate(foundPages);

            // map blogs to transform to an array of JSON
            sortedPages = sortedPages.map(function(page) {
                // make an object
                return AnalyticsPage.toObject(page, { 'hide': 'created count' });
            });

            // send data
            res.json({ 'd': sortedPages });
        }
    });
};

// sort pages by date
function sortPagesByDate(pages) {
    // holds the sorted array
    var sorted = [];

    // add all requests
    _.forEach(pages, function(value) {
        // the temporary object to add
        var obj = _.cloneDeep(value);

        // gets the array sorted
        var sortArr = _.orderBy(obj.accessedBy, ['accessedTime'], ['asc']);

        // initialize the data by different filters
        obj.byYear = orderByYear(sortArr);
        obj.byMonth = orderByMonth(sortArr);
        obj.byWeek = orderByWeek(sortArr);
        obj.byDay = orderByDay(sortArr);

        // remove unnecessary data
        delete obj['accessedBy'];

        // add to the array
        sorted.push(obj);
    });

    return sorted;
};

// orders the data by years
function orderByYear(sortArr) {
    // the year object to return
    var yearObj = {};
    
    // distinct by years
    _.forEach(sortArr, function(value) {
        // get the month and year from the date
        var date = new Date(value.accessedTime);
        var firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        var month = firstDayOfYear.toLocaleString('en-us', { month: 'short' });
        var monthYear = month.concat(' ', date.getFullYear());

        // remove unnecessary data
        delete value['userPublicIP'];
        delete value['userLocalIP'];
        delete value['user'];

        // if the month is already exists
        if(_.includes(_.keys(yearObj), monthYear)){
            // add this object
            yearObj[monthYear].push(value);
        }
        else {
            // create new key
            yearObj[monthYear] = [value];
        }
    });

    return yearObj;
};

// orders the data by month
function orderByMonth(sortArr) {
    // the month object to return
    var monthObj = {};
    
    // distinct by months
    _.forEach(sortArr, function(value) {
        // get the month and year from the date
        var date = new Date(value.accessedTime);
        var firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        var month = firstDayOfMonth.toLocaleString('en-us', { month: 'short' });
        var monthYear = month.concat(' ', date.getFullYear());

        // remove unnecessary data
        delete value['userPublicIP'];
        delete value['userLocalIP'];
        delete value['user'];

        // if the month is already exists
        if(_.includes(_.keys(monthObj), monthYear)){
            // add this object
            monthObj[monthYear].push(value);
        }
        else {
            // create new key
            monthObj[monthYear] = [value];
        }
    });

    return monthObj;
};

// orders the data by week
function orderByWeek(sortArr) {
    // the week object to return
    var weekObj = {};
    
    // distinct by weekss
    _.forEach(sortArr, function(value) {
        // get the month and year from the date
        var date = new Date(value.accessedTime);
        var firstDayOfWeek = new Date(date.getFullYear(), date.getMonth(), date.getDate() + (date.getDay() == 0 ? -6 : 1) - date.getDay());
        var weekday = firstDayOfWeek.toLocaleString('en-us', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
        weekday = weekday.replace(/,/g , '');

        // remove unnecessary data
        delete value['userPublicIP'];
        delete value['userLocalIP'];
        delete value['user'];

        // if the month is already exists
        if(_.includes(_.keys(weekObj), weekday)){
            // add this object
            weekObj[weekday].push(value);
        }
        else {
            // create new key
            weekObj[weekday] = [value];
        }
    });

    return weekObj;
};

// orders the data by day
function orderByDay(sortArr) {
    return {};
};