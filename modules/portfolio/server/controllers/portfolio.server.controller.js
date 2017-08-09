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
    // the file details for this view
    portfolioDetails = require('../data/portfolio'),
    // the file details for this project
    driveOnMetzDetails = require('../data/drive-on-metz'),
    // the file details for this project
    forsakenDetails = require('../data/forsaken'),
    // the file details for this project
    memorylessDetails = require('../data/memoryless'),
    // the file details for this project
    overDriveDetails = require('../data/over-drive'),
    // the file details for this project
    roadRagerDetails = require('../data/road-rager'),
    // the file details for this project
    rollaballModDetails = require('../data/rollaball-mod'),
    // the file details for this project
    squirvivalDetails = require('../data/squirvival');

/**
 * List of Portfolio Items
 */
exports.list = function (req, res) {
    // send data
    res.json(portfolioDetails);
};

/**
 * Show the current portfolio item
 */
exports.read = function (req, res) {
    // send portfolio item
    res.json(req.portfolioItem);
};

/**
 * Portfolio Item middleware
 */
exports.portfolioItemByID = function (req, res, next, id) {
    // get correct project
    var project = getPortfolioItemFile(id);

    // if project doesn't exist
    if(!project) {
        // create the error status
        var err = {
            code: 404
        };

        // send not found
        res.status(404).send({ title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err) + " Project not found." });
    }
    else {
        // bind the data to the request
        req.portfolioItem = project;
        next();
    }
};

/**
 * Gets the file location of the matching portfolio item id
 */
function getPortfolioItemFile(portfolioItemId) {
    // the project 
    var project = undefined;

    // switch and match the correct project
    switch(portfolioItemId) {
        case 'drive-on-metz':
            project = driveOnMetzDetails;
            break;
        case 'forsaken':
            project = forsakenDetails;
            break;
        case 'memoryless':
            project = memorylessDetails;
            break;
        case 'over-drive':
            project = overDriveDetails;
            break;
        case 'road-rager':
            project = roadRagerDetails;
            break;
        case 'rollaball-mod':
            project = rollaballModDetails;
            break;
        case 'squirvival':
            project = squirvivalDetails;
            break;
        default:
            project = undefined;
            break;
    } 
	
	return project;
};