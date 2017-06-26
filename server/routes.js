'use strict';

// the ability to create requests
var requestPromise = require('request-promise');

// the ability to send emails
var nodemailer = require('nodemailer');

// the file system to read/write from/to files locallly
var fs = require("fs");

// the secrets
var secrets = require('./secrets');

// short id generator
var shortid = require('shortid');

// load up the Blog Post model
var BlogPost = require('./models/model-blog-post');

// load up the Saved Blog model
var SavedBlogPost = require('./models/model-saved-blog-post');

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
    // GET =============================================================
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
					res.status(500).send({ error: true, title: "Something went wrong.", message: "Something went wrong. " + err.message});
				}
			}
			else {
				// send internal error
				res.status(500).send({ title: "Something went wrong.", message: "Something went wrong. " + err.message });
			}
		});
	});

	// GET header
	// format /api/header
	app.get('/api/header', function (req, res) {
		var headerFile = "./server/data/header.json";
		// if user is authenticated in the session get admin header
		if (req.isAuthenticated()){
			headerFile = "./server/data/header_admin.json";
		}

		fs.readFile(headerFile, 'utf8', function (err, data) {
			// if no error 
			if(!err) {
				// send data
				res.end( data );
			}
			else {
				// send internal error
				res.status(500).send({ title: "Something went wrong.", message: "Something went wrong. " + err.message });
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
				res.status(500).send({ title: "Something went wrong.", message: "Something went wrong. " + err.message });
			}
		});
	});

	// GET home page information
	// format /api/home
	app.get('/api/home', function (req, res) {
		fs.readFile("./server/data/home.json", 'utf8', function (err, data) {
			// if no error 
			if(!err) {
				// send data
				res.end( data );
			}
			else {
				// send internal error
				res.status(500).send({ title: "Something went wrong.", message: "Something went wrong. " + err.message });
			}
		});
	});

	// GET abou e page information
	// format /api/about
	app.get('/api/about', function (req, res) {
		fs.readFile("./server/data/about-me.json", 'utf8', function (err, data) {
			// if no error 
			if(!err) {
				// send data
				res.end( data );
			}
			else {
				// send internal error
				res.status(500).send({ title: "Something went wrong.", message: "Something went wrong. " + err.message });
			}
		});
	});

	// GET resume page information
	// format /api/resume
	app.get('/api/resume', function (req, res) {
		fs.readFile("./server/data/resume.json", 'utf8', function (err, data) {
			// if no error 
			if(!err) {
				// send data
				res.end( data );
			}
			else {
				// send internal error
				res.status(500).send({ title: "Something went wrong.", message: "Something went wrong. " + err.message });
			}
		});
	});

	// GET portfolio page information or subportfolio information
	// format /api/portfolio
	// format /api/portfolio?id=subPortfolioID
	app.get('/api/portfolio', function (req, res) {
		// if query
		if (req.query.id) {
			var file = getSubPortfolioFile(req.query.id);

			// if file doesn't exist
			if(!file) {
				// send error
				res.status(404).send({ title: "Page not found.", message: "Project not found." });

				return;
			}

			// get contents
			fs.readFile("./server/data/" + file, 'utf8', function (err, data) {
				// if no error 
				if(!err) {
					// send data
					res.end( data );
				}
				else {
					// send internal error
					res.status(500).send({ title: "Something went wrong.", message: "Something went wrong. " + err.message });
				}
			});
		}
		else {
			fs.readFile("./server/data/portfolio.json", 'utf8', function (err, data) {
				// if no error 
				if(!err) {
					// send data
					res.end( data );
				}
				else {
					// send internal error
					res.status(500).send({ title: "Something went wrong.", message: "Something went wrong. " + err.message });
				}
			});
		}
	});

	// GET blog page information
	// format /api/blog
	// format /api/blog?q=someQuery
	// format /api/blog?id=postID
	app.get('/api/blog', function (req, res) {
		// if query on id
		if (req.query.id) {
			// find blog post based on id
			BlogPost.findOne({ customShort : req.query.id }).exec(function(err, foundBlog) {
				// if error occured
				if (err) {
					// send internal error
					res.status(500).send({ message: "Something went wrong. Please try again later." });
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
					res.status(404).send({ title: "Blog does not exist.", message: "Blog does not exist" });
				}
			});
		}
		else {
			// set page number
			var pageNumber = req.query.page !== undefined ? req.query.page : 1;

			fs.readFile("./server/data/blog.json", 'utf8', function (err, data) {
				// if no error 
				if(!err) {
					// get blog with filter/page number
					var blog = getBlogData(data, req.query.q, pageNumber);

					// send data
					res.end( JSON.stringify(blog) );
				}
				else {
					// send internal error
					res.status(500).send({ title: "Something went wrong.", message: "Something went wrong. " + err.message });
				}
			});
		}
	});

	// GET contact page information
	// format /api/contact
	app.get('/api/contact', function (req, res) {
		fs.readFile("./server/data/contact.json", 'utf8', function (err, data) {
			// if no error 
			if(!err) {
				// send data
				res.end( data );
			}
			else {
				// send internal error
				res.status(500).send({ title: "Something went wrong.", message: "Something went wrong. " + err.message });
			}
		});
	});

	// GET admin page information
	// format /api/admin
	app.get('/api/admin', isLoggedIn, function (req, res) {
		// find all saved blog posts
		SavedBlogPost.find({}).exec(function(err, blogs) {
			// if error occured
			if (err) {
				// send internal error
				res.status(500).send({ message: "Something went wrong. Please try again later." });
			}
			// if blogs were found
			else if(blogs) {
				// map blogs to transform to an array of JSON
				blogs = blogs.map(function(blog) {
					return blog.toObject({ hide: 'customShort', transform: true });
				});

				// sort
				blogs = sortSavedBlogs(blogs);

				// send blogs back
				res.end(JSON.stringify({"savedPosts": blogs }));
			}
			else {
				// send not found
				res.status(404).send({ title: "Blog does not exist.", message: "Blog does not exist" });
			}
		});
	});

	// GET image file in root directory
	// format /images/:imageID
	app.get('/images/:imageID', function (req, res) {
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
		res.sendFile(req.params.imageID, options);
	});

	// GET image file in option 1 directory
	// format /images/:directoryID_1/:imageID
	app.get('/images/:directoryID_1/:imageID', function (req, res) {
		// TODO: authentication?
		
		// set options
		var options = {
			root: __dirname + '\\images\\' + req.params.directoryID_1 + '\\',
			dotfiles: 'deny',
			headers: {
				'x-timestamp': Date.now(),
				'x-sent': true
			}
		};
		
		// send file
		res.sendFile(req.params.imageID, options);
	});

	// GET image file in option 1 and option 2 directory
	// format /images/:directoryID_1/:directoryID_2/:imageID
	app.get('/images/:directoryID_1/:directoryID_2/:imageID', function (req, res) {
		// TODO: authentication?

		// set options
		var options = {
			root: __dirname + '\\images\\' + req.params.directoryID_1 + '\\' + req.params.directoryID_2 + '\\',
			dotfiles: 'deny',
			headers: {
				'x-timestamp': Date.now(),
				'x-sent': true
			}
		};
		
		// send file
		res.sendFile(req.params.imageID, options);
	});

	// GET file
	// format /files/:fileID
	app.get('/files/:fileID', function (req, res) {
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
		res.sendFile(req.params.fileID, options);
	});

	// GET file in option 1 directory
	// format /files/:directoryID_1/:fileID
	app.get('/files/:directoryID_1/:fileID', function (req, res) {
		// TODO: authentication?
		
		// set options
		var options = {
			root: __dirname + '\\files\\' + req.params.directoryID_1 + '\\',
			dotfiles: 'deny',
			headers: {
				'x-timestamp': Date.now(),
				'x-sent': true
			}
		};
		
		// send file
		res.sendFile(req.params.fileID, options);
	});

	// GET login page requested
	// format /login
	app.get('/login', function(req, res) {
		// if user is not authenticated in the session, carry on 
		if (!req.isAuthenticated()) {
			// return success
			res.status(200).send({ title: "Success!", message: "No logged in" });
		}
		else {
			// return logged in
			res.status(200).send({ title: "Redirect", message: "User is logged in", isLoggedIn: true });
		}
	});

	// GET logout the user
	// format /logout
	app.get('/logout', function(req, res) {
		// logout and remove from database
		req.logout();
		req.session = null;

		// return success
		res.status(200).send({ title: "Success!", message: "You have successfully logged out!" });
	});

	// =========================================================================
    // POST =============================================================
    // =========================================================================
	// POST send email
	// format /api/sendEmail
	app.post('/api/sendEmail', function (req, res) {
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
			res.status(400).send({ title: "Bad Request.", message: "Bad request. " + errorText});
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
					res.status(500).send({ title: "Something went wrong.", message: "Something went wrong. Please try again later." });
				}

				// return success
				res.status(200).send({ title: "Success!", message: "Your email has been sent!" });
			});		
		}
	});

	// POST save blog
	// format /api/saveBlog
	app.post('/api/saveBlog', isLoggedIn, function (req, res) {
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
			res.status(400).send({ title: "Bad Request.", message: "Bad request. " + errorText});
		}
		else {
			// check if id exists
			if(req.body.id) {
				// check if valid
				if(shortid.isValid(req.body.id)) {
					// set updated values
					var updatedValues = {
						"title": req.body.title,
						"image": req.body.image,
						"shortDescription": req.body.shortDescription,
						"body": req.body.body
					};
					
					// find the blog and update
					SavedBlogPost.findOneAndUpdate({ customShort : req.body.id }, updatedValues).exec(function(err, savedBlog) {
						// if there are any errors, return the error
						if (err) {
							// send internal error
							res.status(500).send({ title: "Something went wrong.", message: "Something went wrong. Please try again later." });
							return;
						}	

						// if saved blog found
						if(savedBlog) {
							// return success
							res.status(200).send({ title: "Success!", message: "You have saved the blog successfully!", blogId: savedBlog.customShort });
						}
						else {
							// send bad request
							res.status(400).send({ title: "Bad Request.", message: "Bad request. Post does not exist."});
						}
					});
				}
				else {
					// send bad request 
					res.status(400).send({ title: "Bad Request.", message: "Bad request. Post does not exist."});
				}
			}
			else {
				// generate a short id
				var shortId = shortid.generate();

				// create the blog
				var savedBlog = new SavedBlogPost({
					customShort: shortId,
					title: req.body.title,
					image: req.body.image,
					shortDescription: req.body.shortDescription,
					body: req.body.body
				});

				// save the blog
				savedBlog.save(function(err, newSavedBlog) {
					if (err) {
						// send internal error
						res.status(500).send({ title: "Something went wrong.", message: "Something went wrong. Please try again later." });
					}
					else {
						// return success
						res.status(200).send({ title: "Success!", message: "You have saved the blog successfully!", blogId: shortId });
					}
				});
			}
		}
	});

	// POST post blog
	// format /api/postBlog
	app.post('/api/postBlog', isLoggedIn, function (req, res) {
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
			res.status(400).send({ title: "Bad Request.", message: "Bad request. " + errorText});
		}
		else {
			// check if id exists
			if(req.body.id) {
				// check if valid
				if(shortid.isValid(req.body.id)) {
					// generate a short id
					var shortId = shortid.generate();

					// create the blog
					var blogPost = new BlogPost({
						customShort: shortId,
						title: req.body.title,
						image: req.body.image,
						shortDescription: req.body.shortDescription,
						body: req.body.body
					});

					// posts the blog
					blogPost.save(function(err, newPostedBlog) {
						if (err) {
							// send internal error
							res.status(500).send({ title: "Something went wrong.", message: "Something went wrong. Please try again later." });
						}
						else {
							// find the blog and remove
							SavedBlogPost.findOneAndRemove({ customShort : req.body.id }).exec(function(err, savedBlog) {
								// if there are any errors, return the error
								if (err) {
									// remove that posted blog
									BlogPost.findByIdAndRemove(newPostedBlog._id).exec(function(err, postedBlog) {
										// send internal error
										res.status(500).send({ title: "Something went wrong.", message: "Something went wrong. Please try again later." });
										return;
									});
								}
								else {
									// if saved blog found
									if(savedBlog) {
										// return success
										res.status(200).send({ title: "Success!", message: "You have posted the blog successfully!", newBlogLink: shortId });
									}
									else {
										// send bad request
										res.status(400).send({ title: "Bad Request.", message: "Bad request. Post does not exist."});
									}
								}
							});
						}
					});
				}
				else {
					// send bad request 
					res.status(400).send({ title: "Bad Request.", message: "Bad request. Post does not exist."});
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
						res.status(500).send({ title: "Something went wrong.", message: "Something went wrong. Please try again later." });
					}
					else {
						// return success
						res.status(200).send({ title: "Success!", message: "You have posted the blog successfully!", newBlogLink: shortId });
					}
				});
			}
		}
	});

	// POST shorten url
	// format /api/shortenUrl
	app.post('/api/shortenUrl', isLoggedIn, function (req, res) {
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
			res.status(400).send({ title: "Bad Request.", message: "Bad request. " + errorText});
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
				res.status(500).send({ title: "Something went wrong.", message: "Something went wrong. Please try again later." });
			});
		}
	});

	// POST sign up
	// format /signup
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/admin', // redirect to the secure profile section
		failureRedirect : '/', // redirect back to the home page if there is an error
		failureFlash : true // allow flash messages
	}));

	// POST login
	// format /login
	app.post('/login', function (req, res, next) {
		passport.authenticate('local-login', function (err, user, info) {
			// if error
			if(err) {
				// send internal error
				return res.status(500).send({ title: "Something went wrong.", message: "Something went wrong. Please try again later." });
			}

			// if user is not authenticated 
			if(!user) {
				// send okay but no okay
				return res.status(200).send({ error: true, title: "Incorrect username/password.", message: "Incorrect username/password." });
			}

			// return sucessful
			return res.status(200).send({ title: "Success!", message: "Successful login." });
		})(req, res, next);
	});
}

// =========================================================================
// Private Functions =============================================================
// =========================================================================
// gets the file location of the matching subportfolio id
function getSubPortfolioFile(subPortfolioID) {
	// if matching the correct id
	if(subPortfolioID == 'drive-on-metz' || subPortfolioID == 'forsaken'
		|| subPortfolioID == 'memoryless' || subPortfolioID == 'over-drive'
		|| subPortfolioID == 'road-rager' || subPortfolioID == 'rollaball-mod'
		|| subPortfolioID == 'squirvival'
	) {
		return subPortfolioID + ".json";
	}
	
	return undefined;
};

// gets the blog data based on page
function getBlogData (data, filter, pageNumber) {
	var itemsPerPage = 3;

	var jsonParse = undefined;

	// parse json
	try {
		jsonParse = JSON.parse(data);
		pageNumber = parseInt(pageNumber);
		
		// if posts
		if(jsonParse.posts) {
			// if filter
			if(filter) {
				jsonParse.posts = applyFilter(jsonParse.posts, filter);
			}

			// sort by date published
			jsonParse.posts = sortPublishedBlogs(jsonParse.posts);

			// total pages
			var totalPages = Math.ceil(jsonParse.posts.length/itemsPerPage);

			// get start/end index
			var start = (pageNumber - 1) * itemsPerPage,
				end = start + itemsPerPage;
			
			// get the sliced version
			var sliced = jsonParse.posts.slice(start, end);

			// set new posts with applied start/end
			jsonParse.posts = jsonParse.posts.slice(start, end);

			// set total pages
			jsonParse.totalPages = new Array(totalPages);

			// set current page
			jsonParse.currentPage = pageNumber;

			// return a portion of array
			return jsonParse;
		}
	}
	catch (err) {
		// send internal error
		return { error: true, title: "Something went wrong.", message: "Something went wrong. " + err.message};
	}
	
	return [];
};

// applies filter on array
function applyFilter(arr, filter) {
	var newArr = [];
	var filterSplit = filter.split(" ");

	// loop through array
	for(var x = 0; x < arr.length; x++) {
		var post = arr[x];

		// based on filter, check if contains
		if (filterSplit.some(function(text) { 
			return post.title.indexOf(text) >= 0 || post.body.indexOf(text) || post.shortDescription.indexOf(text) || post.author.indexOf(text);
		})) {
			// there's at least one
			newArr.push(post);
		}
	}

	return newArr;
};

// sorts the published blogs by date (decending order)
function sortPublishedBlogs(blogs) {
	// sort
	blogs.sort(function(a, b) {
		try {
			var dateA = new Date(a.datePublished);
			var dateB = new Date(b.datePublished);

			// compare date equality
			if (dateA > dateB) {
				return -1;
			}
			if (dateA < dateB) {
				return 1;
			}
		}
		catch (err) {
			return -1;
		}

		// order must be equal
		return 0;
	});
	
	return blogs;
};

// sorts the saved blogs by date (decending order)
function sortSavedBlogs(blogs) {
	// sort
	blogs.sort(function(a, b) {
		try {
			var dateA = new Date(a.dateSaved);
			var dateB = new Date(b.dateSaved);

			// compare date equality
			if (dateA > dateB) {
				return -1;
			}
			if (dateA < dateB) {
				return 1;
			}
		}
		catch (err) {
			return -1;
		}

		// order must be equal
		return 0;
	});
	
	return blogs;
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();

	// send forbidden error
	res.status(403).send({ title: "No Access.", message: "Sorry, you do not have access to this page." });
};