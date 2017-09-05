'use strict';

/**
 * Module dependencies
 */
var // the path
    path = require('path'),
	// chalk for console logging
	clc = require('./clc'),
    // the ability to create requests
    requestPromise = require('request-promise'),
    // the geo ip location
    geoip = require('geoip-lite'),
    // the user agent parser
	useragent = require('useragent');

// set user agent true to stay up to date
//useragent(true);

// logs users IP information
function logUserIPInformation(req) {
	// get client IP
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var ua = useragent.parse(req.headers['user-agent']);

	// create the accessed by
	var accessedBy = {
		userPublicIP: undefined,
		userLocalIP: ip,
		accessedTime: new Date()
	};

	// get user's public ip address and log it
	getUserPublicIP().then(function (response) {
		// get the accessed by object
		accessedBy = getUserIPObject(accessedBy, response, req);

		// build the correct url
		var correctUrl = req.path,
			searchQ = req.query.q,
			page = req.query.page;

		// if query
        if(searchQ) {
            correctUrl += '?q=' + searchQ;
        }

        // if page number
        if(page) {
            // if search query has been applied
            var delimeter = searchQ ? '&' : '?';
            correctUrl += delimeter + 'page=' + page;
        }

		// log the page request
		logPageRequest(accessedBy, correctUrl.toLowerCase(), req.method);
	})
	.catch(function (response) {
		console.log(clc.error("Couldn't get user's ip address: " + response.message));

		// set public IP to the error message
		accessedBy = getUserIPObject(accessedBy, "Couldn't get user's ip address: " + response.message, req);

		// build the correct url
		var correctUrl = req.path,
			searchQ = req.query.q,
			page = req.query.page;

		// if query
        if(searchQ) {
            correctUrl += '?q=' + searchQ;
        }

        // if page number
        if(page) {
            // if search query has been applied
            var delimeter = searchQ ? '&' : '?';
            correctUrl += delimeter + 'page=' + page;
        }

		// log the page request
		logPageRequest(accessedBy, correctUrl.toLowerCase(), req.method);
    });
};

// gets users public IP Address
function getUserPublicIP() {
	// create request
	var options = {
		method: 'GET',
		uri: 'http://bot.whatismyipaddress.com',
		headers: {
			'Content-Type': 'application/json; odata=verbose',
			'Accept': 'application/json; odata=verbose'
		},
		json: true
	};

	// submit request
	return requestPromise(options);
};

// gets the user IP object
function getUserIPObject(accessedBy, userIP, req) {
	// set access by
	var tmpAccessByObject = accessedBy;

	// set public IP
	accessedBy.userPublicIP = userIP;

	// get user's location
	var loc = geoip.lookup(userIP);
	
	// if location was found
	if(loc) {
		accessedBy.location = {
			city: loc.city, 
			country: loc.country,
			ll: {
				latitude: loc.ll[0],
				longitude: loc.ll[1]
			},
			metro: loc.metro,
			range: {
				lowBoundIPBlock: loc.range[0],
				highBoundIPBlock: loc.range[1]
			},
			region: loc.region,
			zip: loc.zip
		}
	}

	// if user is logged in
	if(req.user) {
		accessedBy.user = {
			_id: req.user._id,
			username: req.user.username
		}
	}

	return tmpAccessByObject;
};

// logs the page requested
function logPageRequest(accessedBy, pageRequested, requestType) {
	// setup the request index
	var req = requestType + ':' + pageRequested;

	// FIXME: fix to log to a file instead
	// find page post based on id
	AnalyticsPage.findOne({ request: req }).exec(function(err, foundPage) {
		// if error occurred
		if (err) {
			console.log(clc.error(err.message));
		}
		else if(foundPage) {
			// push the ip who accessed this page
			AnalyticsPage.update({ url : pageRequested }, { $push: { accessedBy: accessedBy }, $inc: { count: 1 } }).exec(function(err, updatedBlog) {
				// if error occurred
				if (err) {
					console.log(clc.error(err.message));
				}
			});
		}
		else {
			// create the analytics for this page
			var analyticsPage = new AnalyticsPage({
				request: requestType + ':' + pageRequested,
				url: pageRequested,
				method: requestType,
				accessedBy: [accessedBy]
			});

			// save
			analyticsPage.save(function(err, newAnalyticsPage) {
				if (err) {
					console.log(clc.error(err.message));
				}
			});
		}
	});
};

 /**
 * Log IP Information
 */
exports.log = function (req, res, next) {
    // log the users ip information
	logUserIPInformation(req);
	
    // go to next
    next();
};