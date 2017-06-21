'use strict';

// the server
var express = require('express');

// the router
var router = express.Router();

// the http body parser
var bodyParser = require('body-parser');

// the http request validator
var expressValidator = require('express-validator');

// the ability to create requests
var requestPromise = require('request-promise');

// the ability to send emails
var nodemailer = require('nodemailer');

// the file system to read/write from/to files locallly
var fs = require("fs");

// the communication to mongo database
var mongoose = require('mongoose'),
	// the scheme for mongoose/mongodb
    Schema = mongoose.Schema;

// the secrets
var secrets = require('./secrets');

// db connection string and options
var options = {
	db: { native_parser: true },
	server: { poolSize: 5 },
	user: secrets.db_user,
	pass: secrets.db_pass
}

// Connect to MongoDB and create/use database
//mongoose.connect(secrets.db)//, options);

// use header/body validation
router.use(expressValidator());

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

/**
 * GET
 */
// GET app name
// format /api/appName
router.get('/api/appName', function (req, res, next) {
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
router.get('/api/header', function (req, res, next) {
	fs.readFile("./server/data/header.json", 'utf8', function (err, data) {
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
router.get('/api/footer', function (req, res, next) {
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
router.get('/api/home', function (req, res, next) {
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
router.get('/api/about', function (req, res, next) {
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
router.get('/api/resume', function (req, res, next) {
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
router.get('/api/portfolio', function (req, res, next) {
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
router.get('/api/blog', function (req, res, next) {
	// if query on id
	if (req.query.id) {
		fs.readFile("./server/data/blog.json", 'utf8', function (err, data) {
			// if err
			if(err) {
				res.status(500).send({ error: true, title: "Something went wrong.", message: "Something went wrong. " + err.message });
				return;
			}

			// get post
			var post = getBlogPost(data, req.query.id);

			// if post doesn't exist
			if(!post) {
				// send error
				res.status(404).send({ title: "Page not found.", message: "Blog Post not found." });
				return;
			}

			// if err
			if(post.error) {
				// send error
				res.status(500).send({ error: true, title: post.title, message: post.message });
				return;
			}

			// send data
			res.end( JSON.stringify(post) );
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
router.get('/api/contact', function (req, res, next) {
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
router.get('/api/admin', function (req, res, next) {
	// TODO: check for permissions
	fs.readFile("./server/data/savedBlogPosts.json", 'utf8', function (err, data) {
		// if no error 
		if(!err) {
			try {
				// parse the json data
				var parsedJson = JSON.parse(data);

				// sort the data by date
				parsedJson.savedPosts = sortSavedBlogs(parsedJson.savedPosts);

				// stringify back
				data = JSON.stringify(parsedJson);

				// send data
				res.end( data );
			}
			catch (err) {
				// send internal error
				res.status(500).send({ title: "Something went wrong.", message: "Something went wrong. " + err.message });
			}
		}
		else {
			// send internal error
			res.status(500).send({ title: "Something went wrong.", message: "Something went wrong. " + err.message });
		}
	});
});

// GET image file in root directory
// format /images/:imageID
router.get('/images/:imageID', function (req, res, next) {
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
router.get('/images/:directoryID_1/:imageID', function (req, res, next) {
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
router.get('/images/:directoryID_1/:directoryID_2/:imageID', function (req, res, next) {
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
router.get('/files/:fileID', function (req, res, next) {
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
router.get('/files/:directoryID_1/:fileID', function (req, res, next) {
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

/**
 * POST
 */
// POST send email
// format /api/sendEmail
router.post('/api/sendEmail', function (req, res, next) {
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

// POST login
// format /api/login
router.post('/api/login', function (req, res, next) {
	// validate existence
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	
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
		// TODO: attempt to login

		// return success
		res.status(200).send({ title: "Success!", message: "You have logged in successfully!" });
	}
});

// POST save blog
// format /api/saveBlog
router.post('/api/saveBlog', function (req, res, next) {
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
		// TODO: save blog

		// return success
		res.status(200).send({ title: "Success!", message: "You have saved the blog successfully!" });
	}
});

// POST post blog
// format /api/postBlog
router.post('/api/postBlog', function (req, res, next) {
	// validate existence
	req.checkBody('title', 'Title is required').notEmpty();
	req.checkBody('image', 'Image is required').notEmpty();
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
		// TODO: post blog

		// return success
		res.status(200).send({ title: "Success!", message: "You have posted the blog successfully!", newBlogLink: "sed-justo-pellentesque-viverra-pede-ac-diam-cras"});
	}
});

// POST shorten url
// format /api/shortenUrl
router.post('/api/shortenUrl', function (req, res, next) {
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

/**
 * Private Functions
 */
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

// gets the blog post matching the postID
function getBlogPost(data, postID) {
	var jsonParse = undefined;

	// parse json
	try {
		jsonParse = JSON.parse(data);

		// if posts
		if(jsonParse.posts) {
			// loop through all posts
			for(var x = 0; x < jsonParse.posts.length; x++) {
				var element = jsonParse.posts[x];
				if(element.url.toLowerCase() == postID.toLowerCase()) {
					return element;
				}
			}
		}
	}
	catch (err) {
		// send internal error
		return { error: true, title: "Something went wrong.", message: "Something went wrong. " + err.message};
	}
	
	return undefined;
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

module.exports = router;