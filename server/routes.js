'use strict';

// the ability to create requests
var requestPromise = require('request-promise');

// the ability to send emails
var nodemailer = require('nodemailer');

// the file system to read/write from/to files locallly
var fs = require('fs');

// short id generator
var shortid = require('shortid');

// the geo ip location
var geoip = require('geoip-lite');

// the user agent parser
var useragent = require('useragent');
useragent(true);

// the secrets
var secrets = require('./secrets');

// chalk for console logging
var clc = require('.././config/lib/clc');

// error message center
var errorMessageCenter = require('.././config/errorMessages');

// load up the Blog Post model
var BlogPost = require('./models/model-blog-post');

// load up the Saved Blog model
var SavedBlogPost = require('./models/model-saved-blog-post');

// load up the Analytics Page model
var AnalyticsPage = require('./models/model-analytics-page');

// load up the Blog Search model
var BlogSearch = require('./models/model-analytics-blog-search');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: secrets.smtp_host,
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: secrets.smtp_email,
        pass: secrets.smtp_pass
    },
	proxy: 'http://localhost:3128',
	service: 'Gmail'
});

module.exports = function(app, passport) {
	// =========================================================================
    // GET =====================================================================
    // =========================================================================
	// GET app name
	// format /api/appName
	app.get('/api/appName', function (req, res) {
		fs.readFile("./server/data/app-details.json", 'utf8', function (err, data) {
			// if no error 
			if(!err) {
				var appName = "";

				var jsonParse = undefined;

				// parse json
				try {
					jsonParse = JSON.parse(data);

					// if appname
					if(jsonParse.appName) {
						appName = jsonParse.appName;
					}
					else {
						appName = "Cameron Hopkins";					
					}

					// send data
					res.end(JSON.stringify({"appName": appName}));
				}
				catch (err) {
					// send internal error
					res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message });
					console.log(clc.error(err.message));
				}
			}
			else {
				// send internal error
				res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message });
				console.log(clc.error(err.message));
			}
		});
	});

	// GET header
	// format /api/header
	app.get('/api/header', function (req, res) {
		var headerFile = "./server/data/header.json";
		var auth = false;

		// if user is authenticated in the session get admin header
		if (req.isAuthenticated()){
			headerFile = "./server/data/header_admin.json";
			auth = true;
		}

		// read file
		fs.readFile(headerFile, 'utf8', function (err, data) {
			// if no error 
			if(!err) {
				// if authenticated
				if(auth) {
					// the parsed data
					var parsedData = null;

					try {
						// parse data
						parsedData = JSON.parse(data);

						// set authenticated
						parsedData.isLoggedIn = true;

						// send data
						res.end( JSON.stringify(parsedData) );
					}
					catch (err) {
						// send internal error
						res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message  });
						console.log(clc.error(err.message));
					}
				}
				else {
					// send data
					res.end(data);
				}
			}
			else {
				// send internal error
				res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message  });
				console.log(clc.error(err.message));
			}
		});
	});

	// GET footer
	// format /api/footer
	app.get('/api/footer', function (req, res) {
		fs.readFile("./server/data/footer.json", 'utf8', function (err, data) {
			// if no error 
			if(!err) {
				// send data
				res.end( data );
			}
			else {
				// send internal error
				res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message  });
				console.log(clc.error(err.message));
			}
		});
	});

	// GET home page information
	// format /api/home
	app.get('/api/home', function (req, res) {
		// get user's IP address and log the page request
		getIPAndLog(req);

		// read file to gain information
		fs.readFile("./server/data/home.json", 'utf8', function (err, data) {
			// if no error 
			if(!err) {
				// send data
				res.end( data );
			}
			else {
				// send internal error
				res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message  });
				console.log(clc.error(err.message));
			}
		});
	});

	// GET abou e page information
	// format /api/about
	app.get('/api/about', function (req, res) {
		// get user's IP address and log the page request
		getIPAndLog(req);

		// read file to gain information
		fs.readFile("./server/data/about-me.json", 'utf8', function (err, data) {
			// if no error 
			if(!err) {
				// send data
				res.end( data );
			}
			else {
				// send internal error
				res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message  });
				console.log(clc.error(err.message));
			}
		});
	});

	// GET resume page information
	// format /api/resume
	app.get('/api/resume', function (req, res) {
		// get user's IP address and log the page request
		getIPAndLog(req);

		// read file to gain information
		fs.readFile("./server/data/resume.json", 'utf8', function (err, data) {
			// if no error 
			if(!err) {
				// send data
				res.end( data );
			}
			else {
				// send internal error
				res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message  });
				console.log(clc.error(err.message));
			}
		});
	});

	// GET portfolio page information or subportfolio information
	// format /api/portfolio
	// format /api/portfolio?id=portfolioItemId
	app.get('/api/portfolio', function (req, res) {
		// get user's IP address and log the page request
		getIPAndLog(req);

		// if query
		if (req.query.id) {
			// get correct file
			var file = getSubPortfolioFile(req.query.id);

			// if file doesn't exist
			if(!file) {
				// send not found
				res.status(404).send({ title: errorMessageCenter.error.status404.title, message: errorMessageCenter.error.status404.message + " Project not found." });
				return;
			}

			// read file to gain information
			fs.readFile("./server/data/" + file, 'utf8', function (err, data) {
				// if no error 
				if(!err) {
					// send data
					res.end( data );
				}
				else {
					// send internal error
					res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message  });
					console.log(clc.error(err.message));
				}
			});
		}
		else {
			// read file to gain information
			fs.readFile("./server/data/portfolio.json", 'utf8', function (err, data) {
				// if no error 
				if(!err) {
					// send data
					res.end( data );
				}
				else {
					// send internal error
					res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message  });
					console.log(clc.error(err.message));
				}
			});
		}
	});

	// GET blog page information
	// format /api/blog
	// format /api/blog?q=someQuery
	// format /api/blog?id=postId
	// format /api/blog?page=pageNumber
	// format /api/blog?q=someQuery&page=pageNumber
	app.get('/api/blog', function (req, res) {
		// get user's IP address and log the page request
		getIPAndLog(req);

		// get the post id if it exists
		var postId = req.query.id;

		// if query on id
		if (postId) {
			// find blog post based on id
			BlogPost.findOne({ customShort : postId }).exec(function(err, foundBlog) {
				// if error occured
				if (err) {
					// send internal error
					res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message  });
					console.log(clc.error(err.message));
				}
				// if blog was found
				else if(foundBlog) {
					// set url
					var url = foundBlog.customShort;

					// make an object
					foundBlog = foundBlog.toObject({ hide: 'customShort', transform: true });
					foundBlog.url = url;

					// update the view count
					BlogPost.update({ customShort : postId },{ $inc: { views: 1 } }).exec(function(err, updatedBlog) {
						// if error occured
						if (err) {
							// send internal error
							res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message  });
							console.log(clc.error(err.message));
						}
						else {
							// send data
							res.end( JSON.stringify(foundBlog) );
						}
					});
				}
				else {
					// send not found
					res.status(404).send({ title: errorMessageCenter.error.status404.title, message: errorMessageCenter.error.status404.message + " Blog does not exist." });
				}
			});
		}
		else {
			// read file to gain information
			fs.readFile("./server/data/blog.json", 'utf8', function (err, data) {
				// if no error 
				if(!err) {
					var jsonParse = undefined;

					// parse json
					try {
						jsonParse = JSON.parse(data);

						// set page number
						var pageNumber = req.query.page ? req.query.page : 1;

						// the options/search query
						var findOptions = req.query.q ? { $text: {$search: req.query.q} } : {};

						// if query
						if(req.query.q) {
							logBlogSearchQuery(req.query.q);
						}

						// find all blog posts
						BlogPost.find(findOptions).exec(function(err, foundBlogs) {
							var pageSize = 1;

							// parse the page number
							pageNumber = parseInt(pageNumber);
							
							// set total pages
							jsonParse.totalPages = foundBlogs ? Math.ceil(foundBlogs.length/pageSize) : 0;

							// set current page
							jsonParse.currentPage = pageNumber;

							// if pages
							if(jsonParse.totalPages > 0) {
								// find all blog posts
								BlogPost.find(findOptions).sort({ datePublished: 'desc' }).skip(pageSize*(pageNumber-1)).limit(pageSize).exec(function(err, sortedPagedBlogs) {
									// map blogs to transform to an array of JSON
									jsonParse.posts = sortedPagedBlogs.map(function(blog) {
										// get the url
										var url = blog.customShort;

										// make an object
										blog = blog.toObject({ hide: 'customShort', transform: true });
										blog.url = url;
										return blog;
									});

									// send data
									res.end( JSON.stringify(jsonParse) );
								});
							}
							else {
								// set to empty
								jsonParse.posts = [];

								// send data
								res.end( JSON.stringify(jsonParse) );
							}
						});
					}
					catch (err) {
						// send internal error
						res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message  });
						console.log(clc.error(err.message));
					}
				}
				else {
					// send internal error
					res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message  });
					console.log(clc.error(err.message));
				}
			});
		}
	});

	// GET saved blog drafts
	// format /api/blog/drafts
	app.get('/api/blog/drafts', isLoggedIn, function (req, res) {
		// get user's IP address and log the page request
		getIPAndLog(req);

		// find all saved blog posts
		SavedBlogPost.find({}).sort({ dateSaved: 'desc' }).exec(function(err, blogs) {
			// if error occured
			if (err) {
				// send internal error
				res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message  });
				console.log(clc.error(err.message));
			}
			// if blogs were found
			else if(blogs) {
				// map blogs to transform to an array of JSON
				blogs = blogs.map(function(blog) {
					return blog.toObject({ hide: 'customShort', transform: true });
				});

				// send blogs back
				res.end(JSON.stringify({ "savedPosts": blogs }));
			}
			else {
				// send not found
				res.status(404).send({ title: errorMessageCenter.error.status404.title, message: errorMessageCenter.error.status404.message + " Blog does not exist." });
			}
		});
	});

	// GET blog edit page information
	// format /api/blog/post/:postId/edit
	app.get('/api/blog/post/:postId/edit', isLoggedIn, function (req, res) {
		// get user's IP address and log the page request
		getIPAndLog(req);

		// if query on id
		if (req.params.postId) {
			// find blog post based on id
			SavedBlogPost.findOne({ customShort : req.params.postId }).exec(function(err, foundSavedBlog) {
				// if error occured
				if (err) {
					// send internal error
					res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message  });
					console.log(clc.error(err.message));
				}
				// if blog was found
				else if(foundSavedBlog) {
					// set url
					var url = foundSavedBlog.customShort;

					// make an object
					foundSavedBlog = foundSavedBlog.toObject({ hide: 'customShort', transform: true });
					foundSavedBlog.url = url;

					// send data
					res.end( JSON.stringify(foundSavedBlog) );
				}
				else {
					// find blog post based on id
					BlogPost.findOne({ customShort : req.params.postId }).exec(function(err, foundBlog) {
						// if error occured
						if (err) {
							// send internal error
							res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message  });
							console.log(clc.error(err.message));
						}
						// if blog was found
						else if(foundBlog) {
							// set url
							var url = foundBlog.customShort;

							// make an object
							foundBlog = foundBlog.toObject({ hide: 'customShort', transform: true });
							foundBlog.url = url;

							// send data
							res.end( JSON.stringify(foundBlog) );
						}
						else {
							// send not found
							res.status(404).send({ title: errorMessageCenter.error.status404.title, message: errorMessageCenter.error.status404.message + " Blog does not exist." });
						}
					});
				}
			});	
		}
		else {
			// send bad request
			res.status(400).send({ title: errorMessageCenter.error.status400.title, message: errorMessageCenter.error.status400.message + " Must have an id to query on." });
		}
	});

	// GET contact page information
	// format /api/contact
	app.get('/api/contact', function (req, res) {
		// get user's IP address and log the page request
		getIPAndLog(req);

		// read file to gain information
		fs.readFile("./server/data/contact.json", 'utf8', function (err, data) {
			// if no error 
			if(!err) {
				// send data
				res.end( data );
			}
			else {
				// send internal error
				res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message  });
				console.log(clc.error(err.message));
			}
		});
	});

	// GET image file in root directory
	// format /images/:imageId
	app.get('/images/:imageId', function (req, res) {
		// TODO: authentication?

		// set options
		var options = {
			root: __dirname + '\\images\\',
			dotfiles: 'deny',
			headers: {
				'x-timestamp': Date.now(),
				'x-sent': true
			}
		};
		
		// send file
		res.sendFile(req.params.imageId, options);
	});

	// GET image file in option 1 directory
	// format /images/:directoryId_1/:imageId
	app.get('/images/:directoryId_1/:imageId', function (req, res) {
		// TODO: authentication?
		
		// set options
		var options = {
			root: __dirname + '\\images\\' + req.params.directoryId_1 + '\\',
			dotfiles: 'deny',
			headers: {
				'x-timestamp': Date.now(),
				'x-sent': true
			}
		};
		
		// send file
		res.sendFile(req.params.imageId, options);
	});

	// GET image file in option 1 and option 2 directory
	// format /images/:directoryId_1/:directoryId_2/:imageId
	app.get('/images/:directoryId_1/:directoryId_2/:imageId', function (req, res) {
		// TODO: authentication?

		// set options
		var options = {
			root: __dirname + '\\images\\' + req.params.directoryId_1 + '\\' + req.params.directoryId_2 + '\\',
			dotfiles: 'deny',
			headers: {
				'x-timestamp': Date.now(),
				'x-sent': true
			}
		};
		
		// send file
		res.sendFile(req.params.imageId, options);
	});

	// GET file
	// format /files/:fileId
	app.get('/files/:fileId', function (req, res) {
		// TODO: authentication?
		
		// set options
		var options = {
			root: __dirname + '\\files\\',
			dotfiles: 'deny',
			headers: {
				'x-timestamp': Date.now(),
				'x-sent': true
			}
		};

		// send file
		res.sendFile(req.params.fileId, options);
	});

	// GET file in option 1 directory
	// format /files/:directoryId_1/:fileId
	app.get('/files/:directoryId_1/:fileId', function (req, res) {
		// TODO: authentication?
		
		// set options
		var options = {
			root: __dirname + '\\files\\' + req.params.directoryId_1 + '\\',
			dotfiles: 'deny',
			headers: {
				'x-timestamp': Date.now(),
				'x-sent': true
			}
		};
		
		// send file
		res.sendFile(req.params.fileId, options);
	});

	// GET login page requested
	// format /login
	app.get('/login', function(req, res) {
		// get user's IP address and log the page request
		getIPAndLog(req);

		// if user is not authenticated in the session, carry on 
		if (!req.isAuthenticated()) {
			// return success
			res.status(200).send({ title: errorMessageCenter.error.status200.title, message: errorMessageCenter.error.status200.message + " No logged in" });
		}
		else {
			// return logged in
			res.status(200).send({ title: errorMessageCenter.error.status200.title, message: errorMessageCenter.error.status200.message + " User is logged in", isLoggedIn: true });
		}
	});

	// GET logout the user
	// format /logout
	app.get('/logout', function(req, res) {
		// get user's IP address and log the page request
		getIPAndLog(req);

		// logout and remove from database
		req.logout();
		req.session = null;

		// return success
		res.status(200).send({ title: errorMessageCenter.error.status200.title, message: errorMessageCenter.error.status200.message + " You have successfully logged out!" });
	});

	// =========================================================================
    // POST ====================================================================
    // =========================================================================
	// POST send email
	// format /api/sendEmail
	app.post('/api/sendEmail', function (req, res) {
		// get user's IP address and log the page request
		getIPAndLog(req);

		//https://script.google.com/macros/s/secrets.google_send_email_script_key/exec

		// validate existence
		req.checkBody('firstName', 'First name is required').notEmpty();
		req.checkBody('lastName', 'Last name is required').notEmpty();
		req.checkBody('email', 'Email is required').notEmpty();
		req.checkBody('subject', 'Subject is required').notEmpty();
		req.checkBody('message', 'Message is required').notEmpty();
		
		// validate errors
		var errors = req.validationErrors();

		// if errors exist
		if (errors) {
			var errorText = "";
			for(var x = 0; x < errors.length; x++) {
				errorText += errors[x].msg + " ";
			}

			// send bad request
			res.status(400).send({ title: errorMessageCenter.error.status400.title, message: errorMessageCenter.error.status400.message + errorText });
		}
		else {
			var fromString = req.body.firstName + " " + req.body.lastName + "<" + req.body.email + ">";
			
			// setup email data with unicode symbols
			let mailOptions = {
				from: fromString, // sender address
				to: secrets.personal_email, // list of receivers
				subject: req.body.subject, // Subject line
				text: req.body.message, // plain text body
				html: '<p>' + req.body.message + '</p>' // html body
			};

			// send mail with defined transport object
			transporter.sendMail(mailOptions, (error, info) => {
				// if an internal error occured
				if (error) {
					// send internal error
					res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message  });
					console.log(clc.error(err.message));
				}
				else {
					// return success
					res.status(200).send({ title: errorMessageCenter.error.status200.title, message: errorMessageCenter.error.status200.message + " Your email has been sent!" });
				}
			});		
		}
	});

	// POST save blog
	// format /api/saveBlog
	app.post('/api/saveBlog', isLoggedIn, function (req, res) {
		// get user's IP address and log the page request
		getIPAndLog(req);

		// validate existence
		req.checkBody('title', 'Title is required').notEmpty();
		
		// validate errors
		var errors = req.validationErrors();

		// if errors exist
		if (errors) {
			var errorText = "";
			for(var x = 0; x < errors.length; x++) {
				errorText += errors[x].msg + " ";
			}

			// send bad request
			res.status(400).send({ title: errorMessageCenter.error.status400.title, message: errorMessageCenter.error.status400.message + errorText });
		}
		else {
			// set post id
			var postId = req.body.id;

			// check if id exists
			if(postId) {
				// check if valid
				if(shortid.isValid(postId)) {
					// set updated values 
					var updatedValues = {
						"title": req.body.title,
						"image": req.body.image,
						"shortDescription": req.body.shortDescription,
						"body": req.body.body
					};
					
					// find the blog and update
					SavedBlogPost.findOneAndUpdate({ customShort : postId }, updatedValues).exec(function(err, updatedSavedBlog) {
						// if there are any errors, return the error
						if (err) {
							// send internal error
							res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message  });
							console.log(clc.error(err.message));
						}	
						// if saved blog found
						else if(updatedSavedBlog) {
							// set url
							var url = updatedSavedBlog.customShort;

							// make an object
							updatedSavedBlog = updatedSavedBlog.toObject({ hide: 'customShort', transform: true });
							updatedSavedBlog.url = url;

							// send success with blog data
							res.end( JSON.stringify(updatedSavedBlog) );
						}
						else {
							// check Published Posts to see if editing a publish post and decided to save
							BlogPost.findOne({ customShort : postId }).exec(function(err, publishedBlog) {
								// if there are any errors, return the error
								if (err) {
									// send internal error
									res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message  });
									console.log(clc.error(err.message));
								}	
								// if saved blog found
								else if(publishedBlog) {
									// create the blog
									var newSavedBlog = new SavedBlogPost({
										"customShort": publishedBlog.customShort,
										"title": req.body.title,
										"image": req.body.image,
										"shortDescription": req.body.shortDescription,
										"body": req.body.body
									});

									// save the blog
									newSavedBlog.save(function(err, newlySavedBlog) {
										if (err) {
											// send internal error
											res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message  });
											console.log(clc.error(err.message));
										}
										else {
											// set url
											var url = newlySavedBlog.customShort;

											// make an object
											newlySavedBlog = newlySavedBlog.toObject({ hide: 'customShort', transform: true });
											newlySavedBlog.url = url;

											// send success with blog data
											res.end( JSON.stringify(newlySavedBlog) );
										}
									});
								}
								else {							
									// send bad request
									res.status(400).send({ title: errorMessageCenter.error.status400.title, message: errorMessageCenter.error.status400.message + " Post does not exist." });
								}
							});
						}
					});
				}
				else {
					// send bad request
					res.status(400).send({ title: errorMessageCenter.error.status400.title, message: errorMessageCenter.error.status400.message + " Post does not exist." });
				}
			}
			else {
				// generate a short id
				var shortId = shortid.generate();

				// create the blog
				var savedBlog = new SavedBlogPost({
					"customShort": shortId,
					"title": req.body.title,
					"image": req.body.image,
					"shortDescription": req.body.shortDescription,
					"body": req.body.body
				});

				// save the blog
				savedBlog.save(function(err, newSavedBlog) {
					if (err) {
						// send internal error
						res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message  });
						console.log(clc.error(err.message));
					}
					else {
						// set url
						var url = newSavedBlog.customShort;

						// make an object
						newSavedBlog = newSavedBlog.toObject({ hide: 'customShort', transform: true });
						newSavedBlog.url = url;

						// send success with blog data
						res.end( JSON.stringify(newSavedBlog) );
					}
				});
			}
		}
	});

	// POST post blog
	// format /api/postBlog
	app.post('/api/postBlog', isLoggedIn, function (req, res) {
		// get user's IP address and log the page request
		getIPAndLog(req);

		// validate existence
		req.checkBody('title', 'Title is required').notEmpty();
		req.checkBody('shortDescription', 'Short Description is required').notEmpty();
		req.checkBody('body', 'Body is required').notEmpty();
		
		// validate errors
		var errors = req.validationErrors();

		// if errors exist
		if (errors) {
			var errorText = "";
			for(var x = 0; x < errors.length; x++) {
				errorText += errors[x].msg + " ";
			}

			// send bad request
			res.status(400).send({ title: errorMessageCenter.error.status400.title, message: errorMessageCenter.error.status400.message + errorText});
		}
		else {
			// set post id
			var postId = req.body.id;

			// check if id exists
			if(postId) {
				// check if valid
				if(shortid.isValid(postId)) {
					// find the blog and remove
					SavedBlogPost.findOne({ customShort : postId }).exec(function(err, savedBlog) {
						// if there are any errors, return the error
						if (err) {
							// send internal error
							res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message  });
							console.log(clc.error(err.message));
						}
						// if the user previously saved a draft
						else if (savedBlog) {
							// set updated values
							var updatedValues = {
								"customShort": savedBlog.customShort,
								"title": req.body.title,
								"image": req.body.image,
								"shortDescription": req.body.shortDescription,
								"body": req.body.body
							};

							// posts the blog
							BlogPost.findOneAndUpdate({ customShort : savedBlog.customShort }, updatedValues, { upsert: true }).exec(function(err, updatedPostedBlog) {
								if (err) {
									// send internal error
									res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message  });
									console.log(clc.error(err.message));
								}
								else {
									// find the blog and remove
									SavedBlogPost.findOneAndRemove({ customShort : savedBlog.customShort }).exec(function(err, removedSavedBlog) {
										if (err) {
											// send internal error
											res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message  });
											console.log(clc.error(err.message));
										}
										else {
											// set url
											var url = updatedPostedBlog.customShort;

											// make an object
											updatedPostedBlog = updatedPostedBlog.toObject({ hide: 'customShort', transform: true });
											updatedPostedBlog.url = url;

											// send success with blog data
											res.end( JSON.stringify(updatedPostedBlog) );
										}
									});
								}
							});
						}
						// user didn't save a draft and decided to edit and post
						else {
							// set updated values
							var updatedValues = {
								"customShort": postId,
								"title": req.body.title,
								"image": req.body.image,
								"shortDescription": req.body.shortDescription,
								"body": req.body.body
							};

							// posts the blog
							BlogPost.findOneAndUpdate({ customShort : postId }, updatedValues).exec(function(err, updatedPostedBlog) {
								if (err) {
									// send internal error
									res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message  });
									console.log(clc.error(err.message));
								}
								else if(updatedPostedBlog) {
									// set url
									var url = updatedPostedBlog.customShort;

									// make an object
									updatedPostedBlog = updatedPostedBlog.toObject({ hide: 'customShort', transform: true });
									updatedPostedBlog.url = url;

									// send success with blog data
									res.end( JSON.stringify(updatedPostedBlog) );
								}
								else {
									// send bad request
									res.status(400).send({ title: errorMessageCenter.error.status400.title, message: errorMessageCenter.error.status400.message + " Post does not exist." });
								}
							});
						}
					});
				}
				else {
					// send bad request
					res.status(400).send({ title: errorMessageCenter.error.status400.title, message: errorMessageCenter.error.status400.message + " Post does not exist." });
				}
			}
			else {
				// generate a short id
				var shortId = shortid.generate();

				// create the blog
				var blogPost = new BlogPost({
					customShort: shortId,
					title: req.body.title,
					image: req.body.image,
					shortDescription: req.body.shortDescription,
					body: req.body.body,
					url: shortId
				});

				// posts the blog
				blogPost.save(function(err, newPostedBlog) {
					if (err) {
						// send internal error
						res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message  });
						console.log(clc.error(err.message));
					}
					else {
						// set url
						var url = newPostedBlog.customShort;

						// make an object
						newPostedBlog = newPostedBlog.toObject({ hide: 'customShort', transform: true });
						newPostedBlog.url = url;

						// send success with blog data
						res.end( JSON.stringify(newPostedBlog) );
					}
				});
			}
		}
	});

	// POST shorten url
	// format /api/shortenUrl
	app.post('/api/shortenUrl', isLoggedIn, function (req, res) {
		// get user's IP address and log the page request
		getIPAndLog(req);

		// validate existence
		req.checkBody('longUrl', 'Long url is required').notEmpty();

		// validate errors
		var errors = req.validationErrors();

		// if errors exist
		if (errors) {
			var errorText = "";
			for(var x = 0; x < errors.length; x++) {
				errorText += errors[x].msg + " ";
			}

			// send bad request
			res.status(400).send({ title: errorMessageCenter.error.status400.title, message: errorMessageCenter.error.status400.message + errorText });
		}
		else {
			// create request
			var options = {
				method: 'POST',
				uri: "https://www.googleapis.com/urlshortener/v1/url?key=" + secrets.google_shorten_url_key,
				headers: {
					'Content-Type': 'application/json; odata=verbose',
					'Accept': 'application/json; odata=verbose'
				},
				body: {
					"longUrl": req.body.longUrl
				},
				json: true
			};

			// submit request
			requestPromise(options).then(function (responseSU) {
				// create return response
				var returnReq = JSON.stringify({
					"shortUrl": responseSU.id,
					"longUrl": responseSU.longUrl
				});

				// send data
				res.end( returnReq );
			}).catch(function (responseSU) {
				// send internal error
				res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message  });
				console.log(clc.error(responseSU.message));
			});
		}
	});

	// POST sign up
	// format /signup
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/about', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the home page if there is an error
		failureFlash : true // allow flash messages
	}));

	// POST login
	// format /login
	app.post('/login', function (req, res, next) {
		// get user's IP address and log the page request
		getIPAndLog(req);

		// authenticate user login
		passport.authenticate('local-login', function (err, user, info) {
			// if error
			if(err) {
				// send internal error
				res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message  });
				console.log(clc.error(err.message));
			}

			// if user is not authenticated 
			if(!user) {
				// send okay but no okay
				return res.status(200).send({ error: true, title: "Incorrect username/password.", message: "Incorrect username/password." });
			}

			// return sucessful
			return res.status(200).send({ title: errorMessageCenter.error.status200.title, message: errorMessageCenter.error.status200.message + " Successful login." });
		})(req, res, next);
	});

	// =========================================================================
    // DELETE ==================================================================
    // =========================================================================
	// DELETE discards saved blog draft
	// format /api/deleteSavedBlog
	app.delete('/api/discardSavedBlogDraft', isLoggedIn, function (req, res) {
		// get user's IP address and log the page request
		getIPAndLog(req);

		// validate existence
		req.checkBody('id', 'Id is required').notEmpty();
		
		// validate errors
		var errors = req.validationErrors();

		// if errors exist
		if (errors) {
			var errorText = "";
			for(var x = 0; x < errors.length; x++) {
				errorText += errors[x].msg + "  ";
			}

			// send bad request
			res.status(400).send({ title: errorMessageCenter.error.status400.title, message: errorMessageCenter.error.status400.message + errorText});
		}
		else {
			// set post id
			var postId = req.body.id;

			// find the blog and remove
			SavedBlogPost.findOneAndRemove({ customShort : postId }).exec(function(err, removedSavedBlog) {
				// if an error occurred
				if (err) {
					// send internal error
					res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message  });
					console.log(clc.error(err.message));
				}
				else if(removedSavedBlog) {
					// return success
					res.status(200).send({ title: errorMessageCenter.error.status200.title, message: errorMessageCenter.error.status200.message + " You have discarded the saved post successfully!" });
				}
				else {
					// send bad request
					res.status(400).send({ title: errorMessageCenter.error.status400.title, message: errorMessageCenter.error.status400.message + " Post does not exist." });
				}
			});
		}
	});

	// DELETE deleted published blog
	// format /api/deletePublishedBlog
	app.delete('/api/deletePublishedBlog', isLoggedIn, function (req, res) {
		// get user's IP address and log the page request
		getIPAndLog(req);

		// validate existence
		req.checkBody('id', 'Id is required').notEmpty();
		
		// validate errors
		var errors = req.validationErrors();

		// if errors exist
		if (errors) {
			var errorText = "";
			for(var x = 0; x < errors.length; x++) {
				errorText += errors[x].msg + "  ";
			}

			// send bad request
			res.status(400).send({ title: errorMessageCenter.error.status400.title, message: errorMessageCenter.error.status400.message + errorText});
		}
		else {
			// set post id
			var postId = req.body.id;

			// find the blog and remove
			BlogPost.findOneAndRemove({ customShort : postId }).exec(function(err, removedPostedBlog) {
				// if an error occurred
				if (err) {
					// send internal error
					res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message  });
					console.log(clc.error(err.message));
				}
				else if(removedPostedBlog) {
					// see if there was saved draft of this same blog
					// find the blog and remove
					SavedBlogPost.findOneAndRemove({ customShort : postId }).exec(function(err, removedSavedBlog) {
						// if an error occurred
						if (err) {
							// send internal error
							res.status(500).send({ error: true, title: errorMessageCenter.error.status500.title, message: errorMessageCenter.error.status500.message  });
							console.log(clc.error(err.message));
						}
						else {
							// return success
							res.status(200).send({ title: errorMessageCenter.error.status200.title, message: errorMessageCenter.error.status200.message + " You have deleted the blog successfully!" });
						}
					});
				}
				else {
					// send bad request
					res.status(400).send({ title: errorMessageCenter.error.status400.title, message: errorMessageCenter.error.status400.message + " Post does not exist." });
				}
			});
		}
	});
}

// =========================================================================
// Private Functions =======================================================
// =========================================================================
// gets the file location of the matching subportfolio id
function getSubPortfolioFile(portfolioItemId) {
	// if matching the correct id
	if(portfolioItemId == 'drive-on-metz' || portfolioItemId == 'forsaken'
		|| portfolioItemId == 'memoryless' || portfolioItemId == 'over-drive'
		|| portfolioItemId == 'road-rager' || portfolioItemId == 'rollaball-mod'
		|| portfolioItemId == 'squirvival'
	) {
		return portfolioItemId + ".json";
	}
	
	return undefined;
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();

	// send forbidden error
	res.status(403).send({ title: errorMessageCenter.error.status403.title, message: errorMessageCenter.error.status403.message });
};

// get user's IP address and log's page request
function getIPAndLog(req) {
	// get client IP
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var ua = useragent.parse(req.headers['user-agent']);

	// create the accessed by
	var accessedBy = {
		userPublicIP: undefined,
		userLocalIP: ip,
		requestType: req.method,
		accessedTime: new Date()
	};

	// get user's public ip address and log it
	getUserPublicIP().then(function (response) {
		// set public IP
		accessedBy.userPublicIP = response

		// get user's location
		var loc = geoip.lookup(response);
		
		// if location was found
		if(loc) {
			accessedBy.location = {
				city: loc.city, 
				country: loc.country,
				ll: {
					latitude: loc.ll[0],
					longitude: loc.ll[1]
				},
				metro: loc.metro,
				range: {
					lowBoundIPBlock: loc.range[0],
					highBoundIPBlock: loc.range[1]
				},
				region: loc.region,
				zip: loc.zip
			}
		}

		// if user is logged in
		if(req.user) {
			accessedBy.user = {
				_id: req.user._id,
				username: req.user.username
			}
		}

		// build the correct url
		var correctUrl = req.path;
		var searchQ = req.query.q,
			page = req.query.page;
		// if query
        if(searchQ) {
            correctUrl += "?q=" + searchQ;
        }

        // if page number
        if(page) {
            // if search query has been applied
            var delimeter = searchQ ? "&" : "?";
            correctUrl += delimeter + "page=" + page;
        }

		// log the page request
		logPageRequest(accessedBy, correctUrl.toLowerCase());
	}).catch(function (response) {
		console.log(clc.error(response.message));
	});
};

// gets users public IP Address
function getUserPublicIP() {
	// create request
	var options = {
		method: 'GET',
		uri: "http://bot.whatismyipaddress.com",
		headers: {
			'Content-Type': 'application/json; odata=verbose',
			'Accept': 'application/json; odata=verbose'
		},
		json: true
	};

	// submit request
	return requestPromise(options);
};

// logs the page requested
function logPageRequest(accessedBy, pageRequested) {
	// find page post based on id
	AnalyticsPage.findOne({ url : pageRequested }).exec(function(err, foundPage) {
		// if error occured
		if (err) {
			console.log(clc.error(err.message));
		}
		else if(foundPage) {
			// push the ip who accessed this page
			AnalyticsPage.update({ url : pageRequested }, { $push: { accessedBy: accessedBy }, $inc: { count: 1 } }).exec(function(err, updatedBlog) {
				// if error occured
				if (err) {
					console.log(clc.error(err.message));
				}
			});
		}
		else {
			// create the analytics for this page
			var analyticsPage = new AnalyticsPage({
				url: pageRequested,
				accessedBy: [accessedBy]
			});

			// save
			analyticsPage.save(function(err, newAnalyticsPage) {
				if (err) {
					console.log(clc.error(err.message));
				}
			});
		}
	});
};

// logs the search query on the blog
function logBlogSearchQuery(queryText) {
	// find search text by query text
	BlogSearch.findOne({ keyword : queryText.toLowerCase() }).exec(function(err, foundSearchText) {
		// if error occured
		if (err) {
			console.log(clc.error(err.message));
		}
		else if(foundSearchText) {
			// push the ip who accessed this page
			BlogSearch.update({ keyword : queryText.toLowerCase() }, { $inc: { hits: 1 } }).exec(function(err, updatedSearchText) {
				// if error occured
				if (err) {
					console.log(clc.error(err.message));
				}
			});
		}
		else {
			// create the analytics for searc
			var blogSearch = new BlogSearch({
				keyword: queryText.toLowerCase()
			});

			// save
			blogSearch.save(function(err, newSearch) {
				if (err) {
					console.log(clc.error(err.message));
				}
			});
		}
	});
};