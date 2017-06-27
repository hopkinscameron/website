angular.module('app').controller('blogPostEditController', ['$scope', '$rootScope', '$compile', '$location', '$routeParams', '$timeout', 'cfpLoadingBar', 'Service', function ($scope, $rootScope, $compile, $location, $routeParams, $timeout, cfpLoadingBar, Service) {
    // determines if a page has already sent a request for load
    var pageRequested = false;
    
    // set jQuery
    $ = window.jQuery;

    // set the path
    Service.afterPath = $location.path();

    // holds the page title
    $scope.pageTitle = Service.appName;

    // get the parameters
    var postId = $routeParams.postId;

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
        },
        "id": undefined
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

    // the confirmation modal
    $scope.confirmationModal = {
        "type": "",
        "title": "",
        "body": "",
        "closeAction": ""        
    };

    // the "save post" modal attributes
    $scope.savedPostModalAttributes = {
        "type": "Save",
        "title": "Successfully Saved!",
        "body": "You have successfully saved this post.",
        "closeAction": ""
    }

    // the "post blog" modal attributes
    $scope.postBlogModalAttributes = {
        "type": "Post",
        "title": "Successful Post!",
        "body": "You have successfully posted this blog.",
        "closeAction": "refresh"
    }

    // when confirmation modal is being closed
    angular.element('#confirmationModal').on('hidden.bs.modal', function (e) {
        // if there is an action
        if($scope.confirmationModal.closeAction == "refresh") {
            // refresh the page
            $window.location.reload();
        }
        else if($scope.confirmationModal.type == $scope.postBlogModalAttributes.type && $scope.confirmationModal.closeAction == "goToBlog") {
            // redirect to blog
            $window.location.href = "#" + $scope.confirmationModal.newBlogLink;
        }
    });

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
    $scope.save = function () {
        // check if title exist
        if($scope.blogPostEditForm.inputs.title && $scope.blogPostEditForm.inputs.title.length > 0) {
            // disable button but showing the form has been submitted
            $scope.blogPostEditForm.formSubmitted = true;

            // the data to send
            var blogPostData = {
                "id": $scope.blogPostEditForm.blogId,
                "title": $scope.blogPostEditForm.inputs.title,
                "image": $scope.blogPostEditForm.inputs.image,
                "shortDescription": $scope.blogPostEditForm.inputs.shortDescription,
                "body": $scope.blogPostEditForm.inputs.body
            };

            // save blog
            Service.saveBlog(blogPostData).then(function (responseSB) {
                // if no error
                if(!responseSB.error) {
                    // get blog page data
                    Service.getBlogPostEditPageData(postId).then(function (responseBP) {
                        // if returned a valid response
                        if (!responseBP.error) {
                            // set the data
                            $scope.post = responseBP;

                            // enable button showing the form has been saved
                            $scope.blogPostEditForm.formSubmitted = false;

                            // set modal details
                            $scope.confirmationModal.type = $scope.savedPostModalAttributes.type;
                            $scope.confirmationModal.title = $scope.savedPostModalAttributes.title;
                            $scope.confirmationModal.body = $scope.savedPostModalAttributes.body;
                            $scope.confirmationModal.closeAction = $scope.savedPostModalAttributes.closeAction;

                            // set id
                            $scope.blogPostEditForm.blogId = responseSB.blogId;

                            // show confirmation modal
                            angular.element('#confirmationModal').modal('toggle');
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
    $scope.post = function () {
        // check for empty values
        checkEmptyValues();

        // check if an error exists
        if(!$scope.blogPostEditForm.errors.title && !$scope.blogPostEditForm.errors.shortDescription && !$scope.blogPostEditForm.errors.body) {
            // disable button but showing the form has been submitted
            $scope.blogPostEditForm.formSubmitted = true;

            // the data to send
            var blogPostData = {
                "id": $scope.blogPostEditForm.blogId,
                "title": $scope.blogPostEditForm.inputs.title,
                "image": $scope.blogPostEditForm.inputs.image,
                "shortDescription": $scope.blogPostEditForm.inputs.shortDescription,
                "body": $scope.blogPostEditForm.inputs.body
            };

            // post blog
            Service.postBlog(blogPostData).then(function (responsePB) {
                // if no error
                if(!responsePB.error) {
                    // set modal details
                    $scope.confirmationModal.type = $scope.postBlogModalAttributes.type;
                    $scope.confirmationModal.title = $scope.postBlogModalAttributes.title;
                    $scope.confirmationModal.body = $scope.postBlogModalAttributes.body;
                    $scope.confirmationModal.closeAction = $scope.postBlogModalAttributes.closeAction;
                    $scope.confirmationModal.newBlogLink = "/blog/post/" + responsePB.newBlogLink;

                    // show confirmation modal
                    angular.element('#confirmationModal').modal('toggle');
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
        
    };

    // deletes the post
    $scope.delete = function () {

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
        Service.getBlogPostEditPageData(postId).then(function (responseBP) {
            // if returned a valid response
            if (!responseBP.error) {
                // set the data
                $scope.post = responseBP;
                $scope.pageTitle = responseBP.title + " | " + Service.appName;
                
                // populate form
                $scope.blogPostEditForm.blogId = responseBP.url;
                $scope.blogPostEditForm.inputs.title = responseBP.title;
                $scope.blogPostEditForm.inputs.image = responseBP.image;
                $scope.blogPostEditForm.inputs.shortDescription = responseBP.shortDescription;
                $scope.blogPostEditForm.inputs.body = responseBP.body;

                // setup page
                setUpPage();
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
}]);