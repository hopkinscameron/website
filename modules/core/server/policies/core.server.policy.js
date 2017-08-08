'use strict';

/**
 * Module dependencies
 */
var // the path
    path = require('path'),
    // the error handler
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Check if Core policy allows
 */
exports.isAllowed = function (req, res, next) {
    // if user is authenticated in the session, carry on 
	if (req.isAuthenticated()) {
        return next();
    }
	else {
        // create forbidden error
        var err = {
            code: 403
        };

        return res.status(403).send({ title: errorHandler.getErrorTitle(err), message: errorHandler.getGenericErrorMessage(err) });
    }
};