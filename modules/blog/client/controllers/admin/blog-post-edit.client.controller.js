'use strict';

// set up the module
var blogModule = angular.module('blog');

// create the controller
blogModule.controller('BlogPostEditController', ['$scope', '$rootScope', '$compile', '$window', '$location', '$routeParams', '$timeout', 'ngDialog', 'Service', 'BlogFactory', function ($scope, $rootScope, $compile, $window, $location, $routeParams, $timeout, ngDialog, Service, BlogFactory) {
    // determines if a page has already sent a request for load
    var pageRequested = false;
    
    // set jQuery
    $ = window.jQuery;

    // set the path
    Service.afterPath = $location.path();

    // holds the page title
    $scope.pageTitle = ApplicationConfiguration.applicationName;

    // get the parameters
    var blogPostId = $routeParams.blogPostId;

    // holds the error
    $scope.error = {
        'error': false,
        'title': '',
        'status': 404,
        'message': ''
    };

    // holds the blog post edit form data
    $scope.blogPostEditForm = {
        'formSubmitted': false,
        'inputs': {
            'title': '',
            'image': '',
            'shortDescription': '',
            'body': ''
        },
        'views': {
            'title': 'title',
            'shortDescription': 'shortDescription',
            'body': 'body'
        },
        'errors': {
            'errorMessage': '',
            'isError': false,
            'title': false,
            'shortDescription': false,
            'body': false
        }
    };

    // tinyMCE options
    $scope.tinymceOptions = {
        setup: function(editor) {           
            editor.on('init', function() {
                
            });
            editor.on('click', function() {
                
            });
            editor.on('focus', function() {
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
        $rootScope.$emit('refreshHeader', {});

        // refresh footer
        $rootScope.$emit('refreshFooter', {});
    }
    else {
        // always refresh header to ensure login
        $rootScope.$emit('refreshHeader', {});
    }

    // on header refresh
    $rootScope.$on('headerRefreshed', function (event, data) {
        // if footer still hasn't been initialized
        if($rootScope.$root.showFooter === undefined) {
            // refresh footer
            $rootScope.$emit('refreshFooter', {});
        }
        else {
            // initialize the page
            initializePage();
        }
    });

    // on footer refresh
    $rootScope.$on('footerRefreshed', function (event, data) {
        // if footer still hasn't been initialized
        if($rootScope.$root.showHeader === undefined) {
            // refresh header
            $rootScope.$emit('refreshHeader', {});
        }
        else {
            // initialize the page
            initializePage();
        }
    });

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
                'id': $scope.post.url,
                'title': $scope.blogPostEditForm.inputs.title,
                'image': $scope.blogPostEditForm.inputs.image,
                'shortDescription': $scope.blogPostEditForm.inputs.shortDescription,
                'body': $scope.blogPostEditForm.inputs.body
            };

            // if there is a previous draft
            if($scope.post.hasDraft) {
                // update draft
                BlogFactory.updateBlogDraft(blogPostData).then(function (responseUBD) {
                    // if no error
                    if(!responseUBD.error) {
                        // enable button showing the form has been saved
                        $scope.blogPostEditForm.formSubmitted = false;

                        // reset data
                        $scope.post = responseUBD;
                        $scope.post.hasDraft = true;

                        // show success
                        showSaveSuccessDialog();
                    }
                    else {
                        // set not submitted
                        $scope.blogPostEditForm.formSubmitted = false;

                        // show error
                        showErrorDialog(responseUBD.message);
                    }
                })
                .catch(function (responseUBD) {
                    // set not submitted
                    $scope.blogPostEditForm.formSubmitted = false;

                    // show error
                    showErrorDialog(responseUBD.message);
                });
            }
            else {
                // save draft
                BlogFactory.savePublishedBlogAsDraft(blogPostData).then(function (responseSPBAD) {
                    // if no error
                    if(!responseSPBAD.error) {
                        // enable button showing the form has been saved
                        $scope.blogPostEditForm.formSubmitted = false;

                        // reset data
                        $scope.post = responseSPBAD;
                        $scope.post.hasDraft = true;

                        // show success
                        showSaveSuccessDialog();
                    }
                    else {
                        // set not submitted
                        $scope.blogPostEditForm.formSubmitted = false;

                        // show error
                        showErrorDialog(responseSPBAD.message);
                    }
                })
                .catch(function (responseSPBAD) {
                    // set not submitted
                    $scope.blogPostEditForm.formSubmitted = false;

                    // show error
                    showErrorDialog(responseSPBAD.message);
                });
            }
        }
        else {
            $scope.blogPostEditForm.errors.title = true;
            $scope.blogPostEditForm.errors.isError = true;
            $scope.blogPostEditForm.errors.errorMessage = 'You must have a title before saving';
        }
    };

    // updates the blog post
    $scope.updateBlog = function () {
        // check for empty values
        checkEmptyValues();

        // check if an error exists
        if(!$scope.blogPostEditForm.errors.title && !$scope.blogPostEditForm.errors.shortDescription && !$scope.blogPostEditForm.errors.body) {
            // disable button but showing the form has been submitted
            $scope.blogPostEditForm.formSubmitted = true;

            // the data to send
            var blogPostData = {
                'id': $scope.post.url,
                'title': $scope.blogPostEditForm.inputs.title,
                'image': $scope.blogPostEditForm.inputs.image,
                'shortDescription': $scope.blogPostEditForm.inputs.shortDescription,
                'body': $scope.blogPostEditForm.inputs.body
            };

            // update blog post
            BlogFactory.updateBlogPost(blogPostData).then(function (responseUPB) {
                // if no error
                if(!responseUPB.error) {
                    // enable button showing the form has been saved
                    $scope.blogPostEditForm.formSubmitted = false;

                    // reset data
                    $scope.post = responseUPB;

                    // show success
                    showPostSuccessDialog();
                }
                else {
                    // set not submitted
                    $scope.blogPostEditForm.formSubmitted = false;

                    // show error
                    showErrorDialog(responseUPB.message);
                }
            })
            .catch(function (responseUPB) {
                // set not submitted
                $scope.blogPostEditForm.formSubmitted = false;

                // show error
                showErrorDialog(responseUPB.message);
            });
        }
    };

    // discards the draft
    $scope.discardDraft = function () {
        // show dialog
		var discardDraftDialog = ngDialog.open({
			template: './dialog/client/views/dialog-warning.client.view.html',
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
			template: './dialog/client/views/dialog-warning.client.view.html',
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
        // get the blog
        BlogFactory.getEditableBlogPost(blogPostId).then(function (responseBP) {
            // if returned a valid response
            if (!responseBP.error) {
                // set the data
                $scope.post = responseBP;
                $scope.post.title = 'Edit Blog Post';
                $scope.pageTitle = responseBP.title + ' | ' + ApplicationConfiguration.applicationName;
                
                // get the draft if it exists
                BlogFactory.getBlogDraft(blogPostId).then(function (responseBD) {
                    // if returned a valid response
                    if (!responseBD.error) {
                        // populate form with draft values
                        $scope.blogPostEditForm.inputs.title = responseBD.title;
                        $scope.blogPostEditForm.inputs.image = responseBD.image;
                        $scope.blogPostEditForm.inputs.shortDescription = responseBD.shortDescription;
                        $scope.blogPostEditForm.inputs.body = responseBD.body;
                        $scope.post.hasDraft = true;

                        // setup page
                        setUpPage();
                    }
                    else {
                        // populate form with origional values
                        $scope.blogPostEditForm.inputs.title = responseBP.title;
                        $scope.blogPostEditForm.inputs.image = responseBP.image;
                        $scope.blogPostEditForm.inputs.shortDescription = responseBP.shortDescription;
                        $scope.blogPostEditForm.inputs.body = responseBP.body;

                        // setup page
                        setUpPage();
                    }
                })
                .catch(function (responseBD) {
                    // populate form with origional values
                    $scope.blogPostEditForm.inputs.title = responseBP.title;
                    $scope.blogPostEditForm.inputs.image = responseBP.image;
                    $scope.blogPostEditForm.inputs.shortDescription = responseBP.shortDescription;
                    $scope.blogPostEditForm.inputs.body = responseBP.body;

                    // setup page
                    setUpPage();
                });                
            }
            else {
                // set error
                $scope.pageTitle = responseBP.title;
                $scope.error.error = true;
                $scope.error.title = responseBP.title;
                $scope.error.status = responseBP.status;
                $scope.error.message = responseBP.message;

                // setup page
                setUpPage();
            }
        })
        .catch(function (responseBP) {
            // set error
            $scope.pageTitle = responseBP.title;
            $scope.error.error = true;
            $scope.error.title = responseBP.title;
            $scope.error.status = responseBP.status;
            $scope.error.message = responseBP.message;

            // setup page
            setUpPage();
        });
    };

    // sets up the page
    function setUpPage() {
        // set up the title
        var titleDOM = document.getElementById('pageTitle');
        var title = '\'' + $scope.pageTitle + '\'';
        titleDOM.setAttribute('ng-bind-html', title);
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
            $scope.blogPostEditForm.errors.errorMessage = 'You must enter a body';
            $scope.blogPostEditForm.errors.body = true;
            $scope.blogPostEditForm.errors.isError = true;
        }
        if (!$scope.blogPostEditForm.inputs.shortDescription || $scope.blogPostEditForm.inputs.shortDescription.length == 0) {
            // set error
            $scope.blogPostEditForm.errors.errorMessage = 'You must enter a short description';
            $scope.blogPostEditForm.errors.shortDescription = true;
            $scope.blogPostEditForm.errors.isError = true;
        }
        if (!$scope.blogPostEditForm.inputs.title || $scope.blogPostEditForm.inputs.title.length == 0) {
            // set error
            $scope.blogPostEditForm.errors.errorMessage = 'You must enter the title';
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
                var header = 'It\'s done, no turning back';
                var body = 'You have successfully discarded.';

                // show dialog
                var successfulDiscardDialog = ngDialog.open({
                    template: './dialog/client/views/dialog-success.client.view.html',
                    controller: 'DialogSuccessController',
                    className: 'ngdialog-theme-default ngdialog-theme-dark custom-width',
                    data: { 'successHeader': header, 'successBody': body }
                });

                // on completion of close
                successfulDiscardDialog.closePromise.then(function (data) {
                    // redirect to this blog's page
                    $window.location.href = '/blog/post/' + $scope.post.url;
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
                var header = 'It\'s done, no turning back';
                var body = 'You have successfully deleted the blog.';

                // show dialog
                var successfulDeleteDialog = ngDialog.open({
                    template: './dialog/client/views/dialog-success.client.view.html',
                    controller: 'DialogSuccessController',
                    className: 'ngdialog-theme-default ngdialog-theme-dark custom-width',
                    data: { 'successHeader': header, 'successBody': body }
                });

                // on completion of close
                successfulDeleteDialog.closePromise.then(function (data) {
                    // redirect to this blog's page
                    $window.location.href = '/blog';
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
        var header = 'Success!';
        var body = 'You have successfully saved this draft.';

        // show dialog
        ngDialog.open({
            template: './dialog/client/views/dialog-success.client.view.html',
            controller: 'DialogSuccessController',
            className: 'ngdialog-theme-default ngdialog-theme-dark custom-width',
            data: { 'successHeader': header, 'successBody': body }
        });
    };

    // shows successful dialog for posting blog
    function showPostSuccessDialog() {
        // create the header and body for the success
        var header = 'Success!';
        var body = 'You have successfully updated this blog.';

        // show dialog
        var successfulPostDialog = ngDialog.open({
            template: './dialog/client/views/dialog-success.client.view.html',
            controller: 'DialogSuccessfulPostController',
            className: 'ngdialog-theme-default ngdialog-theme-dark custom-width',
            data: { 'successHeader': header, 'successBody': body }
        });

        // on completion of close
        successfulPostDialog.closePromise.then(function (data) {
            // check if user wanted to go to blog page or stay here
            if(data.value && data.value.accepted) {
                // redirect to this blog's page
                $window.location.href = '/blog/post/' + $scope.post.url;
            }
        });
    };

    // show error dialog
    function showErrorDialog(err) {
        // create the header and body for the error
        var header = 'Error occurred';
        var body = 'An error occurred trying to process your request. ' + err;

        // show dialog
        ngDialog.open({
            template: './dialog/client/views/dialog-error.client.view.html',
            controller: 'DialogErrorController',
            className: 'ngdialog-theme-default ngdialog-theme-dark custom-width',
            data: { 'errorHeader': header, 'errorBody': body }
        });
    };
}]);