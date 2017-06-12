'use strict';

// the server
var express = require('express');

// the router
var router = express.Router();

// the http body parser
var bodyParser = require('body-parser');

// the http request validator
var expressValidator = require('express-validator');

// the secrets
var secrets = require('./secrets');

// TODO: Delete Don't Need the file system to read/write from/to files locallly
var fs = require("fs");

// the communication to mongo database
var mongoose = require('mongoose'),
	// the scheme for mongoose/mongodb
    Schema = mongoose.Schema;

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

/**
 * GET
 */
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
// format /api/blog?id=postID
router.get('/api/blog', function (req, res, next) {
	// if query
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
		fs.readFile("./server/data/blog.json", 'utf8', function (err, data) {
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

/**
 * POST
 */
// POST send email
// format /api/sendEmail
router.post('/api/sendEmail', function (req, res, next) {
	// https://script.google.com/macros/s/AKfycbx0lHzaYKANP_hcJpzTtu-ky6uAfKKjW6V7JBakRcgg6JW8XN0/exec

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
		/*
		// set incoming information
		var inUsername = req.body.username,
			inToken = req.body.token,
			inEventId = req.body.eventId,
			inComment = req.body.comment;
		*/
		res.status(200).send({ title: "Success!", message: "Here is some test fake success message." });
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

module.exports = router;