angular.module('app').controller('contactController', ['$scope', '$rootScope', '$compile', '$location', 'cfpLoadingBar', 'Service', function ($scope, $rootScope, $compile, $location, cfpLoadingBar, Service) {
    // set jQuery
    $ = window.jQuery;

    // set the path
    Service.afterPath = $location.path();

    // holds the page title
    $scope.pageTitle = "Contact | " + Service.appName;

    // holds the error(s)
    $scope.error = {
        "message": "",
        "error": false,
        "contactForm": {
            "firstName": false,
            "lastName": false,
            "email": false,
            "subject": false,
            "message": false
        }
    };

    // holds contact form
    $scope.contactForm = {
        "inputs": {
            "firstName": "",
            "lastName": "",
            "email": "",
            "subject": "",
            "message": ""
        },
        "views": {
            "firstName": "firstName",
            "lastName": "lastName",
            "email": "email",
            "subject": "subject",
            "message": "message"
        }
    }

    // determines if the page is fully loaded
    $scope.pageFullyLoaded = false;

    // show the header if not shown     
    if (!$rootScope.$root.showHeader) {
        $rootScope.$root.showHeader = true;
    }

    // show the footer if not shown
    if (!$rootScope.$root.showFooter) {
        $rootScope.$root.showFooter = true;
    }

    // get page data
    getPageData();

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
            $scope.error.contactForm.firstName = false;
        }
        // if entering the last name view
        else if (viewId == $scope.contactForm.views.lastName) {
            // reset the error
            $scope.error.contactForm.lastName = false;
        }
        // if entering the email view
        else if (viewId == $scope.contactForm.views.email) {
            // reset the error
            $scope.error.contactForm.email = false;
        }
        // if entering the subject view
        else if (viewId == $scope.contactForm.views.subject) {
            // reset the error
            $scope.error.contactForm.subject = false;
        }
        // if entering the message view
        else if (viewId == $scope.contactForm.views.message) {
            // reset the error
            $scope.error.contactForm.message = false;
        }
    };

    // on call event when the focus leaves
    $scope.viewFocusLeave = function (viewId) {
        // if entering the first name view
        if (viewId == $scope.contactForm.views.firstName) {
            // if user left field blank
            if ($scope.contactForm.inputs.firstName.length == 0) {
                // set error
                $scope.error.contactForm.firstName = true;
            }
        }
        // if entering the last name view
        else if (viewId == $scope.contactForm.views.lastName) {
            // if user left field blank
            if ($scope.contactForm.inputs.lastName.length == 0) {
                // set error
                $scope.error.contactForm.lastName = true;
            }
        }
        // if entering the email view
        else if (viewId == $scope.contactForm.views.email) {
            // if user left field blank
            if (!$rootScope.$root.emailRegex.test($scope.contactForm.inputs.email)) {
                // set error
                $scope.error.contactForm.email = true;
            }
        }
        // if entering the subject view
        else if (viewId == $scope.contactForm.views.subject) {
            // if user left field blank
            if ($scope.contactForm.inputs.subject.length == 0) {
                // set error
                $scope.error.contactForm.subject = true;
            }
        }
        // if entering the message view
        else if (viewId == $scope.contactForm.views.message) {
            // if user left field blank
            if ($scope.contactForm.inputs.message.length == 0) {
                // set error
                $scope.error.contactForm.message = true;
            }
        }

        // check to see if there is an error
        if ($scope.error.contactForm.firstName) {
            // set error
            $scope.error.message = "You must enter your first name";
        }
        else if ($scope.error.contactForm.lastName) {
            // set error
            $scope.error.message = "You must enter your last name";
        }
        else if ($scope.error.contactForm.email) {
            // set error
            $scope.error.message = "You must enter your email";
        }
        else if ($scope.error.contactForm.subject) {
            // set error
            $scope.error.message = "You must enter a subject";
        }
        else if ($scope.error.contactForm.message) {
            // set error
            $scope.error.message = "You must enter a message";
        }
        else {
            // remove error
            $scope.error.message = "";
        }
    };

    // send email to owner (me)
    $scope.sendEmail = function () {
        // check if an error exists
        if(!$scope.error.contactForm.firstName && !$scope.error.contactForm.lastName) {
            // the data to send
            var emailData = {
                "firstName": $scope.contactForm.inputs.firstName,
                "lastName": $scope.contactForm.inputs.lastName,
                "email": $scope.contactForm.inputs.email,
                "subject": $scope.contactForm.inputs.subject,
                "message": $scope.contactForm.inputs.message
            };

            // send email
            Service.sendEmailToOwner(emailData).then(function (responseSE) {
                // if no error
                if(!responseSE.error) {

                }
                else {
                    // show error
                }
                //return { "error": false, "message": responseSE.data.message };
            })
            .catch(function (responseSE) {
                // show error
            });
        }
    };

    // gets the page data
    function getPageData() {
        // get contact page data
        Service.getContactPageData().then(function (responseC) {
            // if returned a valid response
            if (!responseC.error) {
                // set the data
                $scope.contact = responseC;

                // setup page
                setUpPage();
            }
            else {
                // set error
                $scope.pageTitle = responseC.message;

                // set error
                $scope.error.error = true;
                $scope.error.message = responseC.message;

                // setup page
                setUpPage();
            }
        })
        .catch(function (responseC) {
            // set error
            $scope.pageTitle = responseC.message;

            // set error
            $scope.error.error = true;
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
    };
}]);