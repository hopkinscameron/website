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
    // the file system to read/write from/to files locallly
    fs = require('fs');

/**
 * List of Portfolio Items
 */
exports.list = function (req, res) {
    // read file to gain information
    fs.readFile(path.resolve('./server/data/portfolio.json'), 'utf8', function (err, data) {
        // if error
        if(err) {
            // send internal error
            res.status(500).send({ error: true, title: errorHandler.getErrorTitle(err), message: errorHandler.getErrorMessage(err) });
            console.log(clc.error(errorHandler.getErrorMessage(err)));
        }
        else {
            // send data
            res.end(data);
        }
    });
};

/**
 * Show the current portfolio item
 */
exports.read = function (req, res) {
    // send portfolio item
    res.end(JSON.stringify(req.portfolioItem));
};

/**
 * Portfolio Item middleware
 */
exports.portfolioItemByID = function (req, res, next, id) {
    // get correct file
    var file = getPortfolioItemFile(id);

    // if file doesn't exist
    if(!file) {
        // create the error status
        var err = {
            code: 404
        };

        // send not found
        res.status(404).send({ title: errorHandler.getErrorTitle(err), message: errorHandler.getErrorMessage(err) + " Project not found." });
    }
    else {
        // read file to gain information
        fs.readFile(path.join(process.cwd(), 'server/data/', file), 'utf8', function (err, data) {
            // if error
            if(err) {
                // return error
                return next(err);
            }
            else {
                // will hold the portfolio item
                var portfolioItem = undefined;

                try {
                    // parse json
                    portfolioItem = JSON.parse(data);

                    // bind the data to the request
                    req.portfolioItem = portfolioItem;
                    next();
                }
                catch (err) {
                    // return error
                    return next(err);
                }
            }
        });
    }
};

/**
 * Gets the file location of the matching portfolio item id
 */
function getPortfolioItemFile(portfolioItemId) {
	// if matching the correct id
	if(portfolioItemId == 'drive-on-metz' || portfolioItemId == 'forsaken'
		|| portfolioItemId == 'memoryless' || portfolioItemId == 'over-drive'
		|| portfolioItemId == 'road-rager' || portfolioItemId == 'rollaball-mod'
		|| portfolioItemId == 'squirvival'
	) {
		return portfolioItemId + ".json";
	}
	
	return undefined;
};