angular.module('app').controller('adminController', ['$scope', '$rootScope', '$compile', '$location', '$window', '$timeout', 'ngDialog', 'cfpLoadingBar','Service', function ($scope, $rootScope, $compile, $location, $window, $timeout, ngDialog, cfpLoadingBar, Service) {
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
        }
    };

    // tinyMCE options
    $scope.tinymceOptions = {
        setup: function(editor) {           
            editor.on("init", function() {
                
            });
            editor.on("click", function() {
                
            });
            editor.on("focus", function() {
                $scope.viewFocusEnter($scope.adminBlogPostForm.views.body);
            });
        },
        onChange: function(e) {
            // put logic here for keypress and cut/paste changes 
        },
        inline: false,
        plugins : [
            'advlist autolink lists link image charmap preview hr anchor pagebreak',
            'searchreplace wordcount visualblocks visualchars code fullscreen',
            'insertdatetime media nonbreaking save table contextmenu directionality',
            'emoticons template paste textcolor colorpicker textpattern imagetools codesample toc'
        ],
        toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
        toolbar2: 'preview media | forecolor backcolor emoticons | codesample',
        skin: 'lightgray',
        theme : 'modern'
    };

    // determines if on route change should update
    $scope.dontUpdateRoute = false;

    // socket io
    var socket = io.connect('http://localhost:3000',
        {
            "rememberTransport": false, 
            "reconnect": true,
            "reconnection delay": 1000,
            "max reconnection attempts": 10,
            "secure": false
        }
    );

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

    // on the destruction of the controller
    $scope.$on("$destroy", function handler() {
        // disconnect the socket
        socket.disconnect();
    });

    // on route update
    $scope.$on('$routeUpdate', function(){
        // if should update route
        if(!$scope.dontUpdateRoute) {
            var blogId = $location.search().blogId;

            // if query on id
            if(blogId) {
                var post = undefined;

                // find matching post
                $scope.admin.savedPosts.find(function(value, index) {
                    if(value.url == blogId) {
                        post = value;
                    }
                });

                // populate form with post
                $scope.populateForm(post);
            }
            else {
                // populate form with empty
                $scope.populateForm(undefined);
            }
        }

        // reset
        $scope.dontUpdateRoute = false;
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

    // parses date/time
    $scope.parseDateTime = function (dateTime) {
        try {
            // get the time since this date
            var timeSince = $rootScope.$root.getTimeSince(dateTime);

            // if this post is more than a day old or somehow it's in the future!?!
            if(timeSince == "" || timeSince.toLowerCase().includes("day") || timeSince.toLowerCase().includes("month") || timeSince.toLowerCase().includes("year")) {
                // get the locale string format
                return $rootScope.$root.parseDateTime(dateTime);
            }
            
            return timeSince;
        }
        catch (e) {
            return "";
        }
    };

    // checks if post is currently active (populated)
    $scope.isPostActive = function (savedPost) {
        // check both ids defined and check equality on ids
        return savedPost.url && $scope.currentWorkingPost && savedPost.url == $scope.currentWorkingPost.url;
    };

    $scope.newForm = function () {
        // create new form
        $scope.populateForm(undefined);
    };

    // populates form with previously saved data
    $scope.populateForm = function (savedPost) {
        // if user clicked to populate form, don't update the route again
        $scope.dontUpdateRoute = true;

        // if saved post
        if(savedPost) {
            // reset all errors
            $scope.adminBlogPostForm.errors.title = false;
            $scope.adminBlogPostForm.errors.shortDescription = false;
            $scope.adminBlogPostForm.errors.body = false;
            $scope.adminBlogPostForm.errors.isError = false;
            $scope.adminBlogPostForm.errors.errorMessage = "";

            // populate form
            $scope.adminBlogPostForm.inputs.title = savedPost.title;
            $scope.adminBlogPostForm.inputs.image = savedPost.image;
            $scope.adminBlogPostForm.inputs.shortDescription = savedPost.shortDescription;
            $scope.adminBlogPostForm.inputs.body = savedPost.body;

            // set the current working post
            $scope.currentWorkingPost = savedPost;
            $location.search("blogId", $scope.currentWorkingPost.url);
        }
        else {
            // reset all errors
            $scope.adminBlogPostForm.errors.title = false;
            $scope.adminBlogPostForm.errors.shortDescription = false;
            $scope.adminBlogPostForm.errors.body = false;
            $scope.adminBlogPostForm.errors.isError = false;
            $scope.adminBlogPostForm.errors.errorMessage = "";

            // populate form
            $scope.adminBlogPostForm.inputs.title = "";
            $scope.adminBlogPostForm.inputs.image = "";
            $scope.adminBlogPostForm.inputs.shortDescription = "";
            $scope.adminBlogPostForm.inputs.body = "";

            // set the current working post
            $scope.currentWorkingPost = savedPost;
            $location.search("blogId", savedPost);
        }
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

        // if no errors exist
        if(!$scope.adminBlogPostForm.errors.title && !$scope.adminBlogPostForm.errors.shortDescription && !$scope.adminBlogPostForm.errors.body) {
            $scope.adminBlogPostForm.errors.isError = false;
        }
    };

    // saves the blog post
    $scope.saveBlog = function () {
        // check if title exist
        if($scope.adminBlogPostForm.inputs.title && $scope.adminBlogPostForm.inputs.title.length > 0) {
            // disable button but showing the form has been submitted
            $scope.adminBlogPostForm.formSubmitted = true;

            // the data to send
            var blogPostData = {
                "id": $scope.currentWorkingPost ? $scope.currentWorkingPost.url : undefined,
                "title": $scope.adminBlogPostForm.inputs.title,
                "image": $scope.adminBlogPostForm.inputs.image,
                "shortDescription": $scope.adminBlogPostForm.inputs.shortDescription,
                "body": $scope.adminBlogPostForm.inputs.body
            };

            // save blog
            Service.saveBlog(blogPostData).then(function (responseSB) {
                // if no error
                if(!responseSB.error) {
                    // update saved post list
                    Service.getAdminPageData().then(function (responseA) {
                        // if returned a valid response
                        if (!responseA.error) {
                            // set the data
                            $scope.admin = responseA;

                            // enable button showing the form has been saved
                            $scope.adminBlogPostForm.formSubmitted = false;

                            // set the current working post
                            $scope.currentWorkingPost = responseSB;
                            $scope.populateForm($scope.currentWorkingPost);

                            // show success dialog
                            showSaveSuccessDialog();
                        }
                        else {
                            // set error
                            $scope.pageTitle = responseA.title;
                            $scope.error.error = true;
                            $scope.error.title = responseA.title;
                            $scope.error.status = responseA.status;
                            $scope.error.message = responseA.message;
                        }
                    })
                    .catch(function (responseA) {
                        // set error
                        $scope.pageTitle = responseA.title;
                        $scope.error.error = true;
                        $scope.error.title = responseA.title;
                        $scope.error.status = responseA.status;
                        $scope.error.message = responseA.message;
                    });
                }
                else {
                    // show error
                    $scope.adminBlogPostForm.errors.errorMessage = responseSB.message;
                    $scope.adminBlogPostForm.errors.isError = true;
                    $scope.adminBlogPostForm.formSubmitted = false;
                }
            })
            .catch(function (responseSB) {
                // show error
                $scope.adminBlogPostForm.errors.errorMessage = responseSB.message;
                $scope.adminBlogPostForm.errors.isError = true;
                $scope.adminBlogPostForm.formSubmitted = false;
            });
        }
        else {
            $scope.adminBlogPostForm.errors.title = true;
            $scope.adminBlogPostForm.errors.isError = true;
            $scope.adminBlogPostForm.errors.errorMessage = "You must have a title before saving";
        }
    };

    // posts the blog post
    $scope.postBlog = function () {
        // check for empty values
        checkEmptyValues();

        // check if an error exists
        if(!$scope.adminBlogPostForm.errors.title && !$scope.adminBlogPostForm.errors.shortDescription && !$scope.adminBlogPostForm.errors.body) {
            // disable button but showing the form has been submitted
            $scope.adminBlogPostForm.formSubmitted = true;

            // the data to send
            var blogPostData = {
                "id": $scope.currentWorkingPost ? $scope.currentWorkingPost.url : undefined,
                "title": $scope.adminBlogPostForm.inputs.title,
                "image": $scope.adminBlogPostForm.inputs.image,
                "shortDescription": $scope.adminBlogPostForm.inputs.shortDescription,
                "body": $scope.adminBlogPostForm.inputs.body
            };

            // post blog
            Service.postBlog(blogPostData).then(function (responsePB) {
                // if no error
                if(!responsePB.error) {
                    // show success dialog
                    showPostSuccessDialog();
                }
                else {
                    // show error
                    $scope.adminBlogPostForm.errors.errorMessage = responsePB.message;
                    $scope.adminBlogPostForm.errors.isError = true;
                    $scope.adminBlogPostForm.formSubmitted = false;
                }
            })
            .catch(function (responsePB) {
                // show error
                $scope.adminBlogPostForm.errors.errorMessage = responsePB.message;
                $scope.adminBlogPostForm.errors.isError = true;
                $scope.adminBlogPostForm.formSubmitted = false;
            });
        }
    };

    // discards the draft
    $scope.discardDraft = function () {
        // show dialog
		var discardDraftDialog = ngDialog.open({
			template: '/partials/dialogs/dialogWarning.html',
			controller: 'dialogDiscardBlogDraftController',
			className: 'ngdialog-theme-default ngdialog-theme-dark custom-width',
			showClose: false,
			closeByEscape: false,
			closeByDocument: false,
            data: { 'draftToBeDiscarded': $scope.currentWorkingPost }
		});
		
		// on completion of close
        discardDraftDialog.closePromise.then(function (data) {
            // if there is data
			if (data.value && data.value.accepted && data.value.draftToBeDiscarded) {
				// discard blog draft
				discardBlogDraft(data.value.draftToBeDiscarded);
			}
        });
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

                // check to see if currently on a query with blog id
                var blogId = $location.search().blogId;
                if(blogId) {
                    for(var x = 0; x < responseA.savedPosts.length; x++) {
                        if(blogId == responseA.savedPosts[x].url) {
                            $scope.currentWorkingPost = responseA.savedPosts[x];
                            break;
                        }
                    }
                }

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

            // populate the form
            $scope.populateForm($scope.currentWorkingPost);
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

    // discards the blog draft
    function discardBlogDraft(draftToBeDiscarded) {
        // discard the draft
        Service.discardBlogPostDraft(draftToBeDiscarded.url).then(function (responseDB) {
            // if returned a valid response
            if (!responseDB.error) {
                // set no current working post and reload data
                $scope.currentWorkingPost = undefined;
                getPageData();

                // create the header and body for the success
                var header = "It's done, no turning back";
                var body = "You have successfully discarded.";

                // show dialog
                var successfulDiscardDialog = ngDialog.open({
                    template: '/partials/dialogs/dialogSuccess.html',
                    controller: 'dialogSuccessController',
                    className: 'ngdialog-theme-default ngdialog-theme-dark custom-width',
                    data: { 'successHeader': header, 'successBody': body }
                });
            }
            else {
                // show error
                showErrorDialog(responseDB.message);
            }
        })
        .catch(function (responseDB) {
            // show error
            showErrorDialog(responseDB.message);
        });
    };

    // shows successful dialog for saving blog
    function showSaveSuccessDialog() {
        // create the header and body for the success
        var header = "Success!";
        var body = "You have successfully saved this draft.";

        // show dialog
        ngDialog.open({
            template: '/partials/dialogs/dialogSuccess.html',
            controller: 'dialogSuccessController',
            className: 'ngdialog-theme-default ngdialog-theme-dark custom-width',
            data: { 'successHeader': header, 'successBody': body }
        });
    };

    // shows successful dialog for posting blog
    function showPostSuccessDialog() {
        // create the header and body for the success
        var header = "Success!";
        var body = "You have successfully saved this draft.";

        // show dialog
        var successfulPostDialog = ngDialog.open({
            template: '/partials/dialogs/dialogSuccess.html',
            controller: 'dialogSuccessfulPostController',
            className: 'ngdialog-theme-default ngdialog-theme-dark custom-width',
            data: { 'successHeader': header, 'successBody': body }
        });

        // on completion of close
        successfulPostDialog.closePromise.then(function (data) {
            // check if user wanted to go to blog page or stay here
            if(data.value && data.value.accepted) {
                // redirect to this blog's page
                $window.location.href = "#blog/post/" + $scope.currentWorkingPost.url;
            }
            else {
                // reload page instead
                $window.location.reload();
            }
        });
    };

    // show error dialog
    function showErrorDialog(err) {
        // create the header and body for the error
        var header = "Error occurred";
        var body = "An error occurred trying to process your request. " + err;

        // show dialog
        ngDialog.open({
            template: '/partials/dialogs/dialogError.html',
            controller: 'dialogErrorController',
            className: 'ngdialog-theme-default ngdialog-theme-dark custom-width',
            data: { 'errorHeader': header, 'errorBody': body }
        });
    };
    
    // sets up the socket calls
    function setupSocket() {
        // whenever the server is disconnected
        socket.on('disconnect', function() {
            console.log('client socket.io disconnect!');
        });

        // whenever the server emits 'update saved blogs'
        socket.on('update saved blogs', function(data) {
            // get admin page data
            Service.getAdminPageData().then(function (responseA) {
                // if returned a valid response
                if (!responseA.error) {
                    // set the data
                    $scope.admin.savedPosts = responseA.savedPosts;

                    // reset
                    socket.emit('reset');
                }
                else {
                    // set error
                    $scope.pageTitle = responseA.title;
                    $scope.error.error = true;
                    $scope.error.title = responseA.title;
                    $scope.error.status = responseA.status;
                    $scope.error.message = responseA.message;

                    // reset
                    socket.emit('reset');
                }
            })
            .catch(function (responseA) {
                // set error
                $scope.pageTitle = responseA.title;
                $scope.error.error = true;
                $scope.error.title = responseA.title;
                $scope.error.status = responseA.status;
                $scope.error.message = responseA.message;

                // reset
                socket.emit('reset');
            });
        });
    };
}]);