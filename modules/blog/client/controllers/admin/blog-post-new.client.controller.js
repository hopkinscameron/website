angular.module('app').controller('BlogPostNewController', ['$scope', '$rootScope', '$compile', '$location', '$window', '$timeout', 'ngDialog', 'cfpLoadingBar','Service', 'BlogFactory', function ($scope, $rootScope, $compile, $location, $window, $timeout, ngDialog, cfpLoadingBar, Service, BlogFactory) {
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

    // holds the blog post form data
    $scope.blogPostForm = {
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
                $scope.viewFocusEnter($scope.blogPostForm.views.body);
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
                $scope.newBlogPost.savedPosts.find(function(value, index) {
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
        // get the time since this date
        var timeSince = $rootScope.$root.getTimeSince(dateTime);

        // if this post is more than a day old or somehow it's in the future!?!
        if(timeSince == "" || timeSince.toLowerCase().indexOf("day") || timeSince.toLowerCase().indexOf("month") || timeSince.toLowerCase().indexOf("year")) {
            // get the locale string format
            return $rootScope.$root.parseDateTime(dateTime);
        }
        
        return timeSince;
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
            $scope.blogPostForm.errors.title = false;
            $scope.blogPostForm.errors.shortDescription = false;
            $scope.blogPostForm.errors.body = false;
            $scope.blogPostForm.errors.isError = false;
            $scope.blogPostForm.errors.errorMessage = "";

            // populate form
            $scope.blogPostForm.inputs.title = savedPost.title;
            $scope.blogPostForm.inputs.image = savedPost.image;
            $scope.blogPostForm.inputs.shortDescription = savedPost.shortDescription;
            $scope.blogPostForm.inputs.body = savedPost.body;

            // set the current working post
            $scope.currentWorkingPost = savedPost;
            $location.search("blogId", $scope.currentWorkingPost.url);
        }
        else {
            // reset all errors
            $scope.blogPostForm.errors.title = false;
            $scope.blogPostForm.errors.shortDescription = false;
            $scope.blogPostForm.errors.body = false;
            $scope.blogPostForm.errors.isError = false;
            $scope.blogPostForm.errors.errorMessage = "";

            // populate form
            $scope.blogPostForm.inputs.title = "";
            $scope.blogPostForm.inputs.image = "";
            $scope.blogPostForm.inputs.shortDescription = "";
            $scope.blogPostForm.inputs.body = "";

            // set the current working post
            $scope.currentWorkingPost = savedPost;
            $location.search("blogId", savedPost);
        }
    };

    // on call event when the focus enters
    $scope.viewFocusEnter = function (viewId) {
        // if entering the title view
        if (viewId == $scope.blogPostForm.views.title) {
            // reset the error
            $scope.blogPostForm.errors.title = false;
        }
        // if entering the short description view
        else if (viewId == $scope.blogPostForm.views.shortDescription) {
            // reset the error
            $scope.blogPostForm.errors.shortDescription = false;
        }
        // if entering the body view
        else if (viewId == $scope.blogPostForm.views.body) {
            // reset the error
            $scope.blogPostForm.errors.body = false;
        }

        // if no errors exist
        if(!$scope.blogPostForm.errors.title && !$scope.blogPostForm.errors.shortDescription && !$scope.blogPostForm.errors.body) {
            $scope.blogPostForm.errors.isError = false;
        }
    };

    // saves the blog post
    $scope.saveBlog = function () {
        // check if title exist
        if($scope.blogPostForm.inputs.title && $scope.blogPostForm.inputs.title.length > 0) {
            // disable button but showing the form has been submitted
            $scope.blogPostForm.formSubmitted = true;

            // the data to send
            var blogPostData = {
                "id": $scope.currentWorkingPost ? $scope.currentWorkingPost.url : undefined,
                "title": $scope.blogPostForm.inputs.title,
                "image": $scope.blogPostForm.inputs.image,
                "shortDescription": $scope.blogPostForm.inputs.shortDescription,
                "body": $scope.blogPostForm.inputs.body
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
                            $scope.newBlogPost = responseA;

                            // enable button showing the form has been saved
                            $scope.blogPostForm.formSubmitted = false;

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
                    $scope.blogPostForm.errors.errorMessage = responseSB.message;
                    $scope.blogPostForm.errors.isError = true;
                    $scope.blogPostForm.formSubmitted = false;
                }
            })
            .catch(function (responseSB) {
                // show error
                $scope.blogPostForm.errors.errorMessage = responseSB.message;
                $scope.blogPostForm.errors.isError = true;
                $scope.blogPostForm.formSubmitted = false;
            });
        }
        else {
            $scope.blogPostForm.errors.title = true;
            $scope.blogPostForm.errors.isError = true;
            $scope.blogPostForm.errors.errorMessage = "You must have a title before saving";
        }
    };

    // posts the blog post
    $scope.postBlog = function () {
        // check for empty values
        checkEmptyValues();

        // check if an error exists
        if(!$scope.blogPostForm.errors.title && !$scope.blogPostForm.errors.shortDescription && !$scope.blogPostForm.errors.body) {
            // disable button but showing the form has been submitted
            $scope.blogPostForm.formSubmitted = true;

            // the data to send
            var blogPostData = {
                "id": $scope.currentWorkingPost ? $scope.currentWorkingPost.url : undefined,
                "title": $scope.blogPostForm.inputs.title,
                "image": $scope.blogPostForm.inputs.image,
                "shortDescription": $scope.blogPostForm.inputs.shortDescription,
                "body": $scope.blogPostForm.inputs.body
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
                    $scope.blogPostForm.errors.errorMessage = responsePB.message;
                    $scope.blogPostForm.errors.isError = true;
                    $scope.blogPostForm.formSubmitted = false;
                }
            })
            .catch(function (responsePB) {
                // show error
                $scope.blogPostForm.errors.errorMessage = responsePB.message;
                $scope.blogPostForm.errors.isError = true;
                $scope.blogPostForm.formSubmitted = false;
            });
        }
    };

    // discards the draft
    $scope.discardDraft = function () {
        // show dialog
		var discardDraftDialog = ngDialog.open({
			template: './modules/dialog/client/views/dialog-warning.html',
			controller: 'DialogDiscardBlogDraftController',
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
        // get new blog post page data
        BlogFactory.getBlogPostNewPageData().then(function (responseA) {
            // if returned a valid response
            if (!responseA.error) {
                // set the data
                $scope.newBlogPost = responseA;
                
                // holds the animation times
                $scope.newBlogPostAnimations = responseA.savedPosts.length > 0 ? new Array(2) : new Array(1);

                // the initial delayed start time of any animation
                var startTime = 1.5;

                // the incremental start time of every animation (every animation in the array has a value greater than the last by this much)
                var incrementTime = 1;

                // loop through all animation timing and set the times
                for(var x = 0; x < $scope.newBlogPostAnimations.length; x++) {
                    $scope.newBlogPostAnimations[x] = {
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
        if (!$scope.blogPostForm.inputs.body || $scope.blogPostForm.inputs.body.length == 0) {
            // set error
            $scope.blogPostForm.errors.errorMessage = "You must enter a body";
            $scope.blogPostForm.errors.body = true;
            $scope.blogPostForm.errors.isError = true;
        }
        if (!$scope.blogPostForm.inputs.shortDescription || $scope.blogPostForm.inputs.shortDescription.length == 0) {
            // set error
            $scope.blogPostForm.errors.errorMessage = "You must enter a short description";
            $scope.blogPostForm.errors.shortDescription = true;
            $scope.blogPostForm.errors.isError = true;
        }
        if (!$scope.blogPostForm.inputs.title || $scope.blogPostForm.inputs.title.length == 0) {
            // set error
            $scope.blogPostForm.errors.errorMessage = "You must enter the title";
            $scope.blogPostForm.errors.title = true;
            $scope.blogPostForm.errors.isError = true;
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
                    template: './modules/dialog/client/views/dialog-success.html',
                    controller: 'DialogSuccessController',
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
            template: './modules/dialog/client/views/dialog-success.html',
            controller: 'DialogSuccessController',
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
            template: './modules/dialog/client/views/dialog-success.html',
            controller: 'DialogSuccessfulPostController',
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
            template: './modules/dialog/client/views/dialog-error.html',
            controller: 'DialogErrorController',
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
            // get new blog post page data
            BlogFactory.getBlogPostNewPageData().then(function (responseA) {
                // if returned a valid response
                if (!responseA.error) {
                    // set the data
                    $scope.newBlogPost.savedPosts = responseA.savedPosts;

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