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

        // make an obj
        obj = AnalyticsPage.toObject(obj, { 'hide': 'created count accessedBy' });

        // add to the array
        sorted.push(obj);
    });

    return sorted;
};

// orders the data by years
function orderByYear(sortArr) {
    // the year array to return
    var yearArr = [];

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

        // the year obj
        var yearObj = {
            'monthYear': monthYear
        };

        // index of key
        var index = _.findIndex(yearArr, yearObj);

        // if the year is already exists
        if(index != -1){
            // add this object
            yearArr[index].count.push(value);
        }
        else {
            // push new obj
            yearObj.count = [value];
            yearArr.push(yearObj);
        }
    });

    return yearArr;
};

// orders the data by month
function orderByMonth(sortArr) {
    // the month array to return
    var monthArr = [];

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

        // the month obj
        var monthObj = {
            'monthYear': monthYear
        };

        // index of key
        var index = _.findIndex(monthArr, monthObj);

        // if the month is already exists
        if(index != -1){
            // add this object
            monthArr[index].count.push(value);
        }
        else {
            // push new obj
            monthObj.count = [value];
            monthArr.push(monthObj);
        }
    });

    return monthArr;
};

// orders the data by week
function orderByWeek(sortArr) {
    // the week array to return
    var weekArr = [];

    // distinct by weekss
    _.forEach(sortArr, function(value) {
        // get the first day of the week from the date
        var date = new Date(value.accessedTime);
        var firstDayOfWeek = new Date(date.getFullYear(), date.getMonth(), date.getDate() + (date.getDay() == 0 ? -6 : 1) - date.getDay());
        var weekday = firstDayOfWeek.toLocaleString('en-us', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
        weekday = weekday.replace(/,/g , '');

        // remove unnecessary data
        delete value['userPublicIP'];
        delete value['userLocalIP'];
        delete value['user'];

        // the week obj
        var weekObj = {
            'weekday': weekday
        };

        // index of key
        var index = _.findIndex(weekArr, weekObj);

        // if the week is already exists
        if(index != -1){
            // add this object
            weekArr[index].count.push(value);
        }
        else {
            // push new obj
            weekObj.count = [value];
            weekArr.push(weekObj);
        }
    });

    return weekArr;
};

// orders the data by day
function orderByDay(sortArr) {
    // the day array to return
    var dayArr = [];

    // distinct by weekss
    _.forEach(sortArr, function(value) {
        // get midnight date from the date
        var midnightToday = new Date(value.accessedTime);
        midnightToday.setHours(0, 0, 0, 0);
        var day = midnightToday.toLocaleString('en-us', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
        day = day.replace(/,/g , '');

        // remove unnecessary data
        delete value['userPublicIP'];
        delete value['userLocalIP'];
        delete value['user'];

        // the day obj
        var dayObj = {
            'day': day
        };

        // index of key
        var index = _.findIndex(dayArr, dayObj);

        // if the week is already exists
        if(index != -1){
            // add this object
            dayArr[index].count.push(value);
        }
        else {
            // push new obj
            dayObj.count = [value];
            dayArr.push(dayObj);
        }
    });

    return dayArr;
};