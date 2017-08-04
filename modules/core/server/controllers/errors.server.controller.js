'use strict';

/**
 * Module dependencies
 */
var // the path
    path = require('path'),
    // error message center
    errorMessageCenter = require(path.resolve('./config/errorMessages'));

/**
 * Get the error title from error object
 */
exports.getErrorTitle = function (err) {
    var title = '';

    if (err.code) {
        switch (err.code) {
            case 200:
                title = errorMessageCenter.error.status200.title;
                break;
            case 400:
                title = errorMessageCenter.error.status400.title;
                break;
            case 401:
                title = errorMessageCenter.error.status401.title;
                break;
            case 403:
                title = errorMessageCenter.error.status403.title;
                break;
            case 404:
                title = errorMessageCenter.error.status404.title;
                break;
            case 500:
                title = errorMessageCenter.error.status500.title;
                break;
            default:
                title = errorMessageCenter.error.status500.title;
                break;
        }
    } 
    else if (err.title && !err.errors) {
        title = err.title;
    } 
    else {
        for (var errName in err.errors) {
            if (err.errors[errName].title) {
                title = err.errors[errName].title;
            }
        }
    }

    return title;
};

/**
 * Get the error message from error object
 */
exports.getErrorMessage = function (err) {
    var message = '';

    if (err.code) {
        switch (err.code) {
            case 200:
                message = errorMessageCenter.error.status200.message;
                break;
            case 400:
                message = errorMessageCenter.error.status400.message;
                break;
            case 401:
                message = errorMessageCenter.error.status401.message;
                break;
            case 403:
                message = errorMessageCenter.error.status403.message;
                break;
            case 404:
                message = errorMessageCenter.error.status404.message;
                break;
            case 500:
                message = errorMessageCenter.error.status500.message;
                break;
            default:
                message = errorMessageCenter.error.status500.message;
                break;
        }
    } 
    else if (err.message && !err.errors) {
        message = err.message;
    } 
    else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) {
                message = err.errors[errName].message;
            }
        }
    }

    return message;
};