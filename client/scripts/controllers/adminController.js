angular.module('app').controller('adminController', ['$scope', '$rootScope', '$compile', '$location', '$window', '$timeout', 'cfpLoadingBar','Service', function ($scope, $rootScope, $compile, $location, $window, $timeout, cfpLoadingBar, Service) {
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

    // holds the admin blog post form data
    $scope.adminBlogPostForm = {
        "formSubmitted": false,
        "inputs": {
            "title": "",
            "image": "",
            "shortDescription": "",
            "body": ""
        },
        "views": {
            "title": "title",
            "shortDescription": "shortDescription",
            "body": "body"
        },
        "errors": {
            "errorMessage": "",
            "isError": false,
            "title": false,
            "shortDescription": false,
            "body": false
        },
        "id": undefined
    };

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
        // initialize the page
        initializePage();
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
    $scope.start = function() {
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
        // if entering the title view
        if (viewId == $scope.adminBlogPostForm.views.title) {
            // reset the error
            $scope.adminBlogPostForm.errors.title = false;
        }
        // if entering the short description view
        else if (viewId == $scope.adminBlogPostForm.views.shortDescription) {
            // reset the error
            $scope.adminBlogPostForm.errors.shortDescription = false;
        }
        // if entering the body view
        else if (viewId == $scope.adminBlogPostForm.views.body) {
            // reset the error
            $scope.adminBlogPostForm.errors.body = false;
        }
    };

    // on call event when the focus leaves
    $scope.viewFocusLeave = function (viewId) {
        // if entering the title view
        if (viewId == $scope.adminBlogPostForm.views.title) {
            // if user left field blank
            if ($scope.adminBlogPostForm.inputs.title.length == 0) {
                // set error
                $scope.adminBlogPostForm.errors.title = true;
                $scope.adminBlogPostForm.errors.isError = true;
            }
        }
        // if entering the short description view
        else if (viewId == $scope.adminBlogPostForm.views.shortDescription) {
            // if user left field blank
            if ($scope.adminBlogPostForm.inputs.shortDescription.length == 0) {
                // set error
                $scope.adminBlogPostForm.errors.shortDescription = true;
                $scope.adminBlogPostForm.errors.isError = true;
            }
        }
        // if entering the body view
        else if (viewId == $scope.adminBlogPostForm.views.body) {
            // if user left field blank
            if ($scope.adminBlogPostForm.inputs.body.length == 0) {
                // set error
                $scope.adminBlogPostForm.errors.body = true;
                $scope.adminBlogPostForm.errors.isError = true;
            }
        }
        
        // check to see if there is an error
        if ($scope.adminBlogPostForm.errors.title) {
            // set error
            $scope.adminBlogPostForm.errors.errorMessage = "You must enter the title";
        }
        else if ($scope.adminBlogPostForm.errors.shortDescription) {
            // set error
            $scope.adminBlogPostForm.errors.errorMessage = "You must enter a short description";
        }
        else if ($scope.adminBlogPostForm.errors.body) {
            // set error
            $scope.adminBlogPostForm.errors.errorMessage = "You must enter a body";
        }
        else {
            // remove error
            $scope.adminBlogPostForm.errors.errorMessage = "";
            $scope.adminBlogPostForm.errors.isError = false;
        }
    };

    // saves the blog post
    $scope.save = function () {
        // check if title exist
        if($scope.adminBlogPostForm.inputs.title && $scope.adminBlogPostForm.inputs.title.length > 0) {
            // disable button but showing the form has been submitted
            $scope.adminBlogPostForm.formSubmitted = true;

            // the data to send
            var blogPostData = {
                "id": $scope.adminBlogPostForm.id,
                "title": $scope.adminBlogPostForm.inputs.title,
                "image": $scope.adminBlogPostForm.inputs.image,
                "shortDescription": $scope.adminBlogPostForm.inputs.shortDescription,
                "body": $scope.adminBlogPostForm.inputs.body
            };

            // save blog
            Service.saveBlog(blogPostData).then(function (responseL) {
                // if no error
                if(!responseL.error) {
                    // show confirmation screen
                }
                else {
                    // show error
                    $scope.adminBlogPostForm.errors.errorMessage = responseL.message;
                    $scope.adminBlogPostForm.errors.isError = true;
                    $scope.adminBlogPostForm.formSubmitted = false;
                }
            })
            .catch(function (responseL) {
                // show error
                $scope.adminBlogPostForm.errors.errorMessage = responseL.message;
                $scope.adminBlogPostForm.errors.isError = true;
                $scope.adminBlogPostForm.formSubmitted = false;
            });
        }
        else {
            $scope.adminBlogPostForm.error.title = true;
            $scope.adminBlogPostForm.error.isError = true;
            $scope.adminBlogPostForm.error.message = "You must have a title before saving";
        }
    };

    // posts the blog post
    $scope.post = function () {
        // check for empty values
        checkEmptyValues();

        // check if an error exists
        if(!$scope.adminBlogPostForm.errors.title && !$scope.adminBlogPostForm.errors.shortDescription && !$scope.adminBlogPostForm.errors.body) {
            // disable button but showing the form has been submitted
            $scope.adminBlogPostForm.formSubmitted = true;

            // the data to send
            var blogPostData = {
                "id": $scope.adminBlogPostForm.id,
                "title": $scope.adminBlogPostForm.inputs.title,
                "image": $scope.adminBlogPostForm.inputs.image,
                "shortDescription": $scope.adminBlogPostForm.inputs.shortDescription,
                "body": $scope.adminBlogPostForm.inputs.body
            };

            // post blog
            Service.postBlog(blogPostData).then(function (responseL) {
                // if no error
                if(!responseL.error) {
                    // show confirmation screen
                }
                else {
                    // show error
                    $scope.adminBlogPostForm.errors.errorMessage = responseL.message;
                    $scope.adminBlogPostForm.errors.isError = true;
                    $scope.adminBlogPostForm.formSubmitted = false;
                }
            })
            .catch(function (responseL) {
                // show error
                $scope.adminBlogPostForm.errors.errorMessage = responseL.message;
                $scope.adminBlogPostForm.errors.isError = true;
                $scope.adminBlogPostForm.formSubmitted = false;
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

        // get page data
        getPageData();
    };

    // gets the page data
    function getPageData() {
        // get admin page data
        Service.getAdminPageData().then(function (responseA) {
            // if returned a valid response
            if (!responseA.error) {
                // set the data
                $scope.admin = responseA;
                
                // holds the animation times
                $scope.adminAnimations = responseA.savedPosts.length > 0 ? new Array(2) : new Array(1);

                // the initial delayed start time of any animation
                var startTime = 1.5;

                // the incremental start time of every animation (every animation in the array has a value greater than the last by this much)
                var incrementTime = 1;

                // loop through all animation timing and set the times
                for(var x = 0; x < $scope.adminAnimations.length; x++) {
                    $scope.adminAnimations[x] = {
                        'animation-delay': startTime + (x * incrementTime) + 's',
                        '-webkit-animation-delay': startTime + (x * incrementTime) + 's',
                        '-moz-animation-delay': startTime + (x * incrementTime) + 's'
                    };
                }

                // holds the page title
                $scope.pageTitle = "Admin | " + Service.appName;

                // setup page
                setUpPage();
            }
            else {
                // set error
                $scope.pageTitle = responseA.title;
                $scope.error.error = true;
                $scope.error.title = responseA.title;
                $scope.error.status = responseA.status;
                $scope.error.message = responseA.message;

                // setup page
                setUpPage();
            }
        })
        .catch(function (responseA) {
            // set error
            $scope.pageTitle = responseA.title;
            $scope.error.error = true;
            $scope.error.title = responseA.title;
            $scope.error.status = responseA.status;
            $scope.error.message = responseA.message;

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
        // check for any empty values
        if (!$scope.adminBlogPostForm.inputs.body || $scope.adminBlogPostForm.inputs.body.length == 0) {
            // set error
            $scope.adminBlogPostForm.errors.errorMessage = "You must enter a body";
            $scope.adminBlogPostForm.errors.body = true;
            $scope.adminBlogPostForm.errors.isError = true;
        }
        if (!$scope.adminBlogPostForm.inputs.shortDescription || $scope.adminBlogPostForm.inputs.shortDescription.length == 0) {
            // set error
            $scope.adminBlogPostForm.errors.errorMessage = "You must enter a short description";
            $scope.adminBlogPostForm.errors.shortDescription = true;
            $scope.adminBlogPostForm.errors.isError = true;
        }
        if (!$scope.adminBlogPostForm.inputs.title || $scope.adminBlogPostForm.inputs.title.length == 0) {
            // set error
            $scope.adminBlogPostForm.errors.errorMessage = "You must enter the title";
            $scope.adminBlogPostForm.errors.title = true;
            $scope.adminBlogPostForm.errors.isError = true;
        }
    };
}]);