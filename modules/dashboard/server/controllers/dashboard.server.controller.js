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

        // initialize the data by different filters
        obj.byYear = orderByYear(obj.accessedBy);
        obj.byMonth = orderByMonth(obj.accessedBy);
        obj.byWeek = orderByWeek(obj.accessedBy);
        obj.byDay = orderByDay(obj.accessedBy);

        // remove unnecessary data
        delete obj['accessedBy'];

        // add to the array
        sorted.push(obj);
    });

    return sorted;
};

// orders the data by years
function orderByYear(arr) {
    return {};
};

// orders the data by month
function orderByMonth(arr) {
    // gets the array sorted
    var sortArr = _.orderBy(arr, ['accessedBy'], ['desc']);

    // the month object to return
    var monthObj = {};
    
    // distinct by months
    _.forEach(sortArr, function(value) {
        // get the month and year from the date
        var date = new Date(value.accessedTime);
        var firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        var month = firstDayOfMonth.toLocaleString('en-us', { month: "long" });
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
function orderByWeek(arr) {
    return {};
};

// orders the data by day
function orderByDay(arr) {
    return {};
};