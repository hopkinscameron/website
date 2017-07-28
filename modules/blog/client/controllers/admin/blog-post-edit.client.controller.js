angular.module('app').controller('BlogPostEditController', ['$scope', '$rootScope', '$compile', '$window', '$location', '$routeParams', '$timeout', 'ngDialog', 'cfpLoadingBar', 'Service', 'BlogFactory', function ($scope, $rootScope, $compile, $window, $location, $routeParams, $timeout, ngDialog, cfpLoadingBar, Service, BlogFactory) {
    // determines if a page has already sent a request for load
    var pageRequested = false;
    
    // set jQuery
    $ = window.jQuery;

    // set the path
    Service.afterPath = $location.path();

    // holds the page title
    $scope.pageTitle = Service.appName;

    // get the parameters
    var blogPostId = $routeParams.blogPostId;

    // holds the error
    $scope.error = {
        "error": false,
        "title": "",
        "status": 404,
        "message": ""
    };

    // holds the blog post edit form data
    $scope.blogPostEditForm = {
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
                $scope.viewFocusEnter($scope.blogPostEditForm.views.body);
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
        // if entering the title view
        if (viewId == $scope.blogPostEditForm.views.title) {
            // reset the error
            $scope.blogPostEditForm.errors.title = false;
        }
        // if entering the short description view
        else if (viewId == $scope.blogPostEditForm.views.shortDescription) {
            // reset the error
            $scope.blogPostEditForm.errors.shortDescription = false;
        }
        // if entering the body view
        else if (viewId == $scope.blogPostEditForm.views.body) {
            // reset the error
            $scope.blogPostEditForm.errors.body = false;
        }

        // if no errors exist
        if(!$scope.blogPostEditForm.errors.title && !$scope.blogPostEditForm.errors.shortDescription && !$scope.blogPostEditForm.errors.body) {
            $scope.blogPostEditForm.errors.isError = false;
        }
    };

    // saves the blog post
    $scope.saveBlog = function () {
        // check if title exist
        if($scope.blogPostEditForm.inputs.title && $scope.blogPostEditForm.inputs.title.length > 0) {
            // disable button but showing the form has been submitted
            $scope.blogPostEditForm.formSubmitted = true;

            // the data to send
            var blogPostData = {
                "id": $scope.post.url,
                "title": $scope.blogPostEditForm.inputs.title,
                "image": $scope.blogPostEditForm.inputs.image,
                "shortDescription": $scope.blogPostEditForm.inputs.shortDescription,
                "body": $scope.blogPostEditForm.inputs.body
            };

            // save blog
            BlogFactory.saveBlog(blogPostData).then(function (responseSB) {
                // if no error
                if(!responseSB.error) {
                    // enable button showing the form has been saved
                    $scope.blogPostEditForm.formSubmitted = false;

                    // reset data
                    $scope.post = responseSB;

                    // show success
                    showSaveSuccessDialog();
                }
                else {
                    // show error
                    $scope.blogPostEditForm.errors.errorMessage = responseSB.message;
                    $scope.blogPostEditForm.errors.isError = true;
                    $scope.blogPostEditForm.formSubmitted = false;
                }
            })
            .catch(function (responseSB) {
                // show error
                $scope.blogPostEditForm.errors.errorMessage = responseSB.message;
                $scope.blogPostEditForm.errors.isError = true;
                $scope.blogPostEditForm.formSubmitted = false;
            });
        }
        else {
            $scope.blogPostEditForm.errors.title = true;
            $scope.blogPostEditForm.errors.isError = true;
            $scope.blogPostEditForm.errors.errorMessage = "You must have a title before saving";
        }
    };

    // posts the blog post
    $scope.postBlog = function () {
        // check for empty values
        checkEmptyValues();

        // check if an error exists
        if(!$scope.blogPostEditForm.errors.title && !$scope.blogPostEditForm.errors.shortDescription && !$scope.blogPostEditForm.errors.body) {
            // disable button but showing the form has been submitted
            $scope.blogPostEditForm.formSubmitted = true;

            // the data to send
            var blogPostData = {
                "id": $scope.post.url,
                "title": $scope.blogPostEditForm.inputs.title,
                "image": $scope.blogPostEditForm.inputs.image,
                "shortDescription": $scope.blogPostEditForm.inputs.shortDescription,
                "body": $scope.blogPostEditForm.inputs.body
            };

            // post blog
            BlogFactory.postBlog(blogPostData).then(function (responsePB) {
                // if no error
                if(!responsePB.error) {
                    // enable button showing the form has been saved
                    $scope.blogPostEditForm.formSubmitted = false;

                    // reset data
                    $scope.post = responsePB;

                    // show success
                    showPostSuccessDialog();
                }
                else {
                    // show error
                    $scope.blogPostEditForm.errors.errorMessage = responsePB.message;
                    $scope.blogPostEditForm.errors.isError = true;
                    $scope.blogPostEditForm.formSubmitted = false;
                }
            })
            .catch(function (responsePB) {
                // show error
                $scope.blogPostEditForm.errors.errorMessage = responsePB.message;
                $scope.blogPostEditForm.errors.isError = true;
                $scope.blogPostEditForm.formSubmitted = false;
            });
        }
    };

    // discards the draft
    $scope.discardDraft = function () {
        // show dialog
		var discardDraftDialog = ngDialog.open({
			template: './dialog/client/views/dialog-warning.html',
			controller: 'DialogDiscardBlogDraftController',
			className: 'ngdialog-theme-default ngdialog-theme-dark custom-width',
			showClose: false,
			closeByEscape: false,
			closeByDocument: false,
            data: { 'draftToBeDiscarded': $scope.post }
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

    // deletes the post
    $scope.deleteBlog = function () {
        // show dialog
		var deleteBlogDialog = ngDialog.open({
			template: './dialog/client/views/dialog-warning.html',
			controller: 'DialogDeleteBlogController',
			className: 'ngdialog-theme-default ngdialog-theme-dark custom-width',
			showClose: false,
			closeByEscape: false,
			closeByDocument: false,
            data: { 'blogToBeDeleted': $scope.post }
		});
		
		// on completion of close
        deleteBlogDialog.closePromise.then(function (data) {
            // if there is data
			if (data.value && data.value.accepted && data.value.blogToBeDeleted) {
				// discard blog draft
				deleteBlog(data.value.blogToBeDeleted);
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
        // get blog page data
        BlogFactory.getBlogPostEditPageInformation(blogPostId).then(function (responseBIE) {
            // if returned a valid response
            if (!responseBIE.error) {
                // set the data
                $scope.post = responseBIE;
                $scope.pageTitle = responseBIE.title + " | " + Service.appName;
                
                // populate form
                $scope.blogPostEditForm.inputs.title = responseBIE.title;
                $scope.blogPostEditForm.inputs.image = responseBIE.image;
                $scope.blogPostEditForm.inputs.shortDescription = responseBIE.shortDescription;
                $scope.blogPostEditForm.inputs.body = responseBIE.body;

                // setup page
                setUpPage();
            }
            else {
                // set error
                $scope.pageTitle = responseBIE.title;
                $scope.error.error = true;
                $scope.error.title = responseBIE.title;
                $scope.error.status = responseBIE.status;
                $scope.error.message = responseBIE.message;

                // setup page
                setUpPage();
            }
        })
        .catch(function (responseBIE) {
            // set error
            $scope.pageTitle = responseBIE.title;
            $scope.error.error = true;
            $scope.error.title = responseBIE.title;
            $scope.error.status = responseBIE.status;
            $scope.error.message = responseBIE.message;

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
        if (!$scope.blogPostEditForm.inputs.body || $scope.blogPostEditForm.inputs.body.length == 0) {
            // set error
            $scope.blogPostEditForm.errors.errorMessage = "You must enter a body";
            $scope.blogPostEditForm.errors.body = true;
            $scope.blogPostEditForm.errors.isError = true;
        }
        if (!$scope.blogPostEditForm.inputs.shortDescription || $scope.blogPostEditForm.inputs.shortDescription.length == 0) {
            // set error
            $scope.blogPostEditForm.errors.errorMessage = "You must enter a short description";
            $scope.blogPostEditForm.errors.shortDescription = true;
            $scope.blogPostEditForm.errors.isError = true;
        }
        if (!$scope.blogPostEditForm.inputs.title || $scope.blogPostEditForm.inputs.title.length == 0) {
            // set error
            $scope.blogPostEditForm.errors.errorMessage = "You must enter the title";
            $scope.blogPostEditForm.errors.title = true;
            $scope.blogPostEditForm.errors.isError = true;
        }
    };

    // discards the blog draft
    function discardBlogDraft(draftToBeDiscarded) {
        // discard the draft
        BlogFactory.discardBlogPostDraft(draftToBeDiscarded.url).then(function (responseDB) {
            // if returned a valid response
            if (!responseDB.error) {
                // create the header and body for the success
                var header = "It's done, no turning back";
                var body = "You have successfully discarded.";

                // show dialog
                var successfulDiscardDialog = ngDialog.open({
                    template: './dialog/client/views/dialog-success.html',
                    controller: 'DialogSuccessController',
                    className: 'ngdialog-theme-default ngdialog-theme-dark custom-width',
                    data: { 'successHeader': header, 'successBody': body }
                });

                // on completion of close
                successfulDiscardDialog.closePromise.then(function (data) {
                    // redirect to this blog's page
                    $window.location.href = "#blog/post/" + $scope.post.url;
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

    // deletes the blog
    function deleteBlog(blogToBeDeleted) {
        // delete the post
        BlogFactory.deleteBlogPost(blogToBeDeleted.url).then(function (responseDB) {
            // if returned a valid response
            if (!responseDB.error) {
                // create the header and body for the success
                var header = "It's done, no turning back";
                var body = "You have successfully deleted the blog.";

                // show dialog
                var successfulDeleteDialog = ngDialog.open({
                    template: './dialog/client/views/dialog-success.html',
                    controller: 'DialogSuccessController',
                    className: 'ngdialog-theme-default ngdialog-theme-dark custom-width',
                    data: { 'successHeader': header, 'successBody': body }
                });

                // on completion of close
                successfulDeleteDialog.closePromise.then(function (data) {
                    // redirect to this blog's page
                    $window.location.href = "#blog";
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
            template: './dialog/client/views/dialog-success.html',
            controller: 'DialogSuccessController',
            className: 'ngdialog-theme-default ngdialog-theme-dark custom-width',
            data: { 'successHeader': header, 'successBody': body }
        });

        // refresh the page
        //$window.location.reload();
    };

    // shows successful dialog for posting blog
    function showPostSuccessDialog() {
        // create the header and body for the success
        var header = "Success!";
        var body = "You have successfully posted this blog.";

        // show dialog
        var successfulPostDialog = ngDialog.open({
            template: './dialog/client/views/dialog-success.html',
            controller: 'DialogSuccessfulPostController',
            className: 'ngdialog-theme-default ngdialog-theme-dark custom-width',
            data: { 'successHeader': header, 'successBody': body }
        });

        // on completion of close
        successfulPostDialog.closePromise.then(function (data) {
            // redirect to this blog's page
            $window.location.href = "#blog/post/" + $scope.post.url;
        });
    };

    // show error dialog
    function showErrorDialog(err) {
        // create the header and body for the error
        var header = "Error occurred";
        var body = "An error occurred trying to process your request. " + err;

        // show dialog
        ngDialog.open({
            template: './dialog/client/views/dialog-error.html',
            controller: 'DialogErrorController',
            className: 'ngdialog-theme-default ngdialog-theme-dark custom-width',
            data: { 'errorHeader': header, 'errorBody': body }
        });
    };
}]);