'use strict';

/**
 * Module dependencies
 */
var // the path
    path = require('path'),
    // the error handler
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Check if Blog policy allows
 */
exports.isAllowed = function (req, res, next) {
    // if user is authenticated in the session, carry on 
	if (req.isAuthenticated()) {
        return next();
    }
	else {
        // create unauthorized error
        return res.status(401).send({ title: errorHandler.getErrorTitle({ code: 401 }), message: errorHandler.getGenericErrorMessage({ code: 401 }) });
    }
};