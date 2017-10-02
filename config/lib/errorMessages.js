'use strict';

// messages for errors
var errorMessageCenter = {
    status200: {
        title: 'Success!',
        message: 'Success!'
    },
    status400: {
        title: 'Bad Request',
        message: 'Sorry, looks like you sent a bad request. Maybe try again?'
    },
    status401: {
        title: 'Not Authorized',
        message: 'Sorry, looks like you you\'re not authorized to be here. Let\'s turn back and go somewhere else.'
    },
    status403: {
        title: 'Forbidden',
        message: 'Sorry, looks like you shouldn\'t be here. Guess there is nothing to see here. Let\'s keep it moving.'
    },
    status404: {
        title: 'Page Not Found',
        message: 'Sorry, looks like the page you were looking for does not exist.'
    },
    status500: {
        title: 'Internal Error',
        message: 'Sorry, something went wrong on our end. We\'re going to fix that. Try reloading the page.'
    }
};

exports.error = errorMessageCenter;