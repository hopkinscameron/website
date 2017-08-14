'use strict';

// messages for errors
var errorMessageCenter = {
    status200: {
        title: 'Success!',
        message: 'Success!'
    },
    status400: {
        title: 'Bad Request.',
        message: 'Bad request.'
    },
    status401: {
        title: 'Something went wrong',
        message: 'Something went wrong. Please try again later.'
    },
    status403: {
        title: 'Forbidden. No Access.',
        message: 'Sorry, you do not have access to this page.'
    },
    status404: {
        title: 'Page does not exist.',
        message: 'Page does not exist.'
    },
    status500: {
        title: 'Something went wrong',
        message: 'Something went wrong. Please try again later.'
    }
};

exports.error = errorMessageCenter;