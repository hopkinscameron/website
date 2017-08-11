'use strict';

angular.module('app').controller('ContactController', ['$scope', '$rootScope', '$compile', '$location', '$timeout', 'cfpLoadingBar', 'Service', 'ContactFactory', function ($scope, $rootScope, $compile, $location, $timeout, cfpLoadingBar, Service, ContactFactory) {
    // determines if a page has already sent a request for load
    var pageRequested = false;
    
    // set jQuery
    $ = window.jQuery;

    // set the path
    Service.afterPath = $location.path();

    // holds the error
    $scope.error = {
        "error": false,
        "title": "",
        "status": 404,
        "message": ""
    };

    // holds contact form information
    $scope.contactForm = {
        "formSubmitted": false,
        "inputs": {
            "firstName": "", //"John",
            "lastName": "", //"Doe",
            "email": "", //"johndoedoebrobrolikewhatnow@johndoedoebrobrolikewhatnow.com",
            "subject": "", //"Man, this John Doe Bro",
            "message": "", //"Yo wassup bro, this is john doe bro. Just testing out your email to make sure it works"
        },
        "maxLength": {
            "firstName": 15,
            "lastName": 15,
            "subject": 30,
            "message": 400
        },
        "views": {
            "firstName": "firstName",
            "lastName": "lastName",
            "email": "email",
            "subject": "subject",
            "message": "message"
        },
        "errors": {
            "errorMessage": "",
            "isError": false,
            "firstName": false,
            "lastName": false,
            "email": false,
            "subject": false,
            "message": false
        }
    }

    // determines if email is in transit
    $scope.emailInTransit = false;

    // determines if the page is fully loaded
    $scope.pageFullyLoaded = false;

    // check if header/footer was initialized
    if($rootScope.$root.showHeader === undefined || $rootScope.$root.showFooter === undefined) {
        // refresh header
        $rootScope.$emit("refreshHeader", {});

        // refresh footer
        $rootScope.$emit("refreshFooter", {});
    }
    else {
        // always refresh header to ensure login
        $rootScope.$emit("refreshHeader", {});
    }

    // on header refresh
    $rootScope.$on("headerRefreshed", function (event, data) {
        // if footer still hasn't been initialized
        if($rootScope.$root.showFooter === undefined) {
            // refresh footer
            $rootScope.$emit("refreshFooter", {});
        }
        else {
            // initialize the page
            initializePage();
        }
    });

    // on footer refresh
    $rootScope.$on("footerRefreshed", function (event, data) {
        // if footer still hasn't been initialized
        if($rootScope.$root.showHeader === undefined) {
            // refresh header
            $rootScope.$emit("refreshHeader", {});
        }
        else {
            // initialize the page
            initializePage();
        }
    });

    // on loading http intercepter start
    $scope.start = function () {
        // start loader
        cfpLoadingBar.start();
    };

    // on loading http intercepter complete
    $scope.complete = function () {
        // complete loader
        cfpLoadingBar.complete();
    };

    // on call event when the focus enters
    $scope.viewFocusEnter = function (viewId) {
        // if entering the first name view
        if (viewId == $scope.contactForm.views.firstName) {
            // reset the error
            $scope.contactForm.errors.firstName = false;
        }
        // if entering the last name view
        else if (viewId == $scope.contactForm.views.lastName) {
            // reset the error
            $scope.contactForm.errors.lastName = false;
        }
        // if entering the email view
        else if (viewId == $scope.contactForm.views.email) {
            // reset the error
            $scope.contactForm.errors.email = false;
        }
        // if entering the subject view
        else if (viewId == $scope.contactForm.views.subject) {
            // reset the error
            $scope.contactForm.errors.subject = false;
        }
        // if entering the message view
        else if (viewId == $scope.contactForm.views.message) {
            // reset the error
            $scope.contactForm.errors.message = false;
        }
    };

    // on call event when the focus leaves
    $scope.viewFocusLeave = function (viewId) {
        // if entering the first name view
        if (viewId == $scope.contactForm.views.firstName) {
            // if user left field blank
            if ($scope.contactForm.inputs.firstName.length == 0) {
                // set error
                $scope.contactForm.errors.firstName = true;
                $scope.contactForm.errors.isError = true;
            }
        }
        // if entering the last name view
        else if (viewId == $scope.contactForm.views.lastName) {
            // if user left field blank
            if ($scope.contactForm.inputs.lastName.length == 0) {
                // set error
                $scope.contactForm.errors.lastName = true;
                $scope.contactForm.errors.isError = true;
            }
        }
        // if entering the email view
        else if (viewId == $scope.contactForm.views.email) {
            // if user left field blank
            if (!$rootScope.$root.emailRegex.test($scope.contactForm.inputs.email)) {
                // set error
                $scope.contactForm.errors.email = true;
                $scope.contactForm.errors.isError = true;
            }
        }
        // if entering the subject view
        else if (viewId == $scope.contactForm.views.subject) {
            // if user left field blank
            if ($scope.contactForm.inputs.subject.length == 0) {
                // set error
                $scope.contactForm.errors.subject = true;
                $scope.contactForm.errors.isError = true;
            }
        }
        // if entering the message view
        else if (viewId == $scope.contactForm.views.message) {
            // if user left field blank
            if ($scope.contactForm.inputs.message.length == 0) {
                // set error
                $scope.contactForm.errors.message = true;
                $scope.contactForm.errors.isError = true;
            }
        }

        // check to see if there is an error
        if ($scope.contactForm.errors.firstName) {
            // set error
            $scope.contactForm.errors.errorMessage = "You must enter your first name";
        }
        else if ($scope.contactForm.errors.lastName) {
            // set error
            $scope.contactForm.errors.errorMessage = "You must enter your last name";
        }
        else if ($scope.contactForm.errors.email) {
            // set error
            $scope.contactForm.errors.errorMessage = "You must enter your email";
        }
        else if ($scope.contactForm.errors.subject) {
            // set error
            $scope.contactForm.errors.errorMessage = "You must enter a subject";
        }
        else if ($scope.contactForm.errors.message) {
            // set error
            $scope.contactForm.errors.errorMessage = "You must enter a message";
        }
        else {
            // remove error
            $scope.contactForm.errors.errorMessage = "";
            $scope.contactForm.errors.isError = false;
        }
    };

    // check text length
	$scope.checkTextLength = function (viewId) {
        // if the user tried to go over the max limit of the view
        if (viewId == $scope.contactForm.views.firstName && $scope.contactForm.inputs.firstName.length > $scope.contactForm.maxLength.firstName) {
            // set the text to not go over the limit
            $scope.contactForm.inputs.firstName = $scope.contactForm.inputs.firstName.substring(0, $scope.contactForm.maxLength.firstName);
        }
        else if (viewId == $scope.contactForm.views.lastName && $scope.contactForm.inputs.lastName.length > $scope.contactForm.maxLength.lastName) {
            // set the text to not go over the limit
            $scope.contactForm.inputs.lastName = $scope.contactForm.inputs.lastName.substring(0, $scope.contactForm.maxLength.lastName);
        }
        else if (viewId == $scope.contactForm.views.subject && $scope.contactForm.inputs.subject.length > $scope.contactForm.maxLength.subject) {
            // set the text to not go over the limit
            $scope.contactForm.inputs.subject = $scope.contactForm.inputs.subject.substring(0, $scope.contactForm.maxLength.subject);
        }
        else if (viewId == $scope.contactForm.views.message && $scope.contactForm.inputs.message.length > $scope.contactForm.maxLength.message) {
            // set the text to not go over the limit
            $scope.contactForm.inputs.message = $scope.contactForm.inputs.message.substring(0, $scope.contactForm.maxLength.message);
        }
	};

    // send email to owner (me)
    $scope.sendEmail = function () {
        // check for empty values
        checkEmptyValues();

        // check if an error exists
        if(!$scope.contactForm.errors.firstName && !$scope.contactForm.errors.lastName && !$scope.contactForm.errors.email && !$scope.contactForm.errors.subject && !$scope.contactForm.errors.message) {
            // disable button but setting email in transit
            $scope.emailInTransit = true;
            
            // the data to send
            var emailData = {
                "firstName": $scope.contactForm.inputs.firstName,
                "lastName": $scope.contactForm.inputs.lastName,
                "email": $scope.contactForm.inputs.email,
                "subject": $scope.contactForm.inputs.subject,
                "message": $scope.contactForm.inputs.message
            };

            // send email
            ContactFactory.sendEmailToOwner(emailData).then(function (responseSE) {
                // if no error
                if(!responseSE.error) {
                    $timeout(hideContactForm, 2500);
                }
                else {
                    // show error
                    $scope.contactForm.errors.errorMessage = responseSE.message;
                    $scope.contactForm.errors.isError = true;
                    $scope.emailInTransit = false;
                }
            })
            .catch(function (responseSE) {
                // show error
                $scope.contactForm.errors.errorMessage = responseSE.message;
                $scope.contactForm.errors.isError = true;
                $scope.emailInTransit = false;
            });
        }
    };

    // initialize page
    function initializePage() {
        // show the header if not shown     
        if (!$rootScope.$root.showHeader) {
            $rootScope.$root.showHeader = true;
        }

        // show the footer if not shown
        if (!$rootScope.$root.showFooter) {
            $rootScope.$root.showFooter = true;
        }

        // if page hasn't been requested yet
        if(!pageRequested) {
            pageRequested = true;

            // get page data
            getPageData();
        }
    };
    
    // gets the page data
    function getPageData() {
        // get contact page data
        ContactFactory.getContactPageInformation().then(function (responseC) {
            // if returned a valid response
            if (!responseC.error) {
                // set the data
                $scope.contact = responseC;
                $scope.contact.title = 'Contact';
                
                // the initial delayed start time of any animation
                var startTime = 1.5;

                // the incremental start time of every animation (every animation in the array has a value greater than the last by this much)
                var incrementTime = 1;

                // holds the animation times
                $scope.contactAnimations = $rootScope.$root.getAnimationDelays(startTime, incrementTime, 3);

                // holds the page title
                $scope.pageTitle = "Contact | " + Service.appName;

                // setup page
                setUpPage();
            }
            else {
                // set error
                $scope.pageTitle = responseC.title;
                $scope.error.error = true;
                $scope.error.title = responseC.title;
                $scope.error.status = responseC.status;
                $scope.error.message = responseC.message;

                // setup page
                setUpPage();
            }
        })
        .catch(function (responseC) {
            // set error
            $scope.pageTitle = responseC.title;
            $scope.error.error = true;
            $scope.error.title = responseC.title;
            $scope.error.status = responseC.status;
            $scope.error.message = responseC.message;

            // setup page
            setUpPage();
        });
    };

    // sets up the page
    function setUpPage() {
        // set up the title
        var titleDOM = document.getElementById("pageTitle");
        var title = "\'" + $scope.pageTitle + "\'";
        titleDOM.setAttribute("ng-bind-html", title);
        $compile(titleDOM)($scope);

        // set page fully loaded
        $scope.pageFullyLoaded = true;

        // show the page after a timeout
        $timeout(showPage, $rootScope.$root.showPageTimeout);
    };

    // shows the page
    function showPage() {
        // check if collapsing is already occuring
        if(!angular.element('#pageShow').hasClass('collapsing')) {
            // show the page
            angular.element('#pageShow').collapse('show');
        }
    };
    
    // checks for any empty values
    function checkEmptyValues() {
        if (!$scope.contactForm.inputs.message || $scope.contactForm.inputs.message.length == 0) {
            // set error
            $scope.contactForm.errors.errorMessage = "You must enter a message";
            $scope.contactForm.errors.message = true;
            $scope.contactForm.errors.isError = true;
        }
        if (!$scope.contactForm.inputs.subject || $scope.contactForm.inputs.subject.length == 0) {
            // set error
            $scope.contactForm.errors.errorMessage = "You must enter a subject";
            $scope.contactForm.errors.subject = true;
            $scope.contactForm.errors.isError = true;
        }
        if (!$scope.contactForm.inputs.email || $scope.contactForm.inputs.email.length == 0) {
            // set error
            $scope.contactForm.errors.errorMessage = "You must enter your email";
            $scope.contactForm.errors.email = true;
            $scope.contactForm.errors.isError = true;
        }
        if (!$scope.contactForm.inputs.lastName || $scope.contactForm.inputs.lastName.length == 0) {
            // set error
            $scope.contactForm.errors.errorMessage = "You must enter your last name";
            $scope.contactForm.errors.lastName = true;
            $scope.contactForm.errors.isError = true;
        }
        // check for any empty values
        if (!$scope.contactForm.inputs.firstName || $scope.contactForm.inputs.firstName.length == 0) {
            // set error
            $scope.contactForm.errors.errorMessage = "You must enter your first name";
            $scope.contactForm.errors.firstName = true;
            $scope.contactForm.errors.isError = true;
        }
    };

    // hide contact form
    function hideContactForm() {
        // collapse the form
        $('#contact-form').collapse().on('hidden.bs.collapse', function () {
            $timeout(showThankYouNote, 1500);
        })
    };

    // shows thank you note
    function showThankYouNote() {
        $('#thank-you-message').collapse('show');
    };
}]);