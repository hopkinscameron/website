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

/*
	GET
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
			res.status(500).send({message: "Something went wrong. " + err.message});
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
			res.status(500).send({message: "Something went wrong. " + err.message});
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
			res.status(500).send({message: "Something went wrong. " + err.message});
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
			res.status(500).send({message: "Something went wrong. " + err.message});
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
			res.status(500).send({message: "Something went wrong. " + err.message});
		}
	});
});

// GET portfolio page information
// format /api/portfolio
router.get('/api/portfolio', function (req, res, next) {
	fs.readFile("./server/data/portfolio.json", 'utf8', function (err, data) {
		// if no error 
		if(!err) {
			// send data
			res.end( data );
		}
		else {
			// send internal error
			res.status(500).send({message: "Something went wrong. " + err.message});
		}
	});
});

// GET subportfolio page information
// format /api/subportfolio?id=subPortfolioID
router.get('/api/subportfolio', function (req, res, next) {
	// if query
	if (req.query.id) {
		// TODO get correct file
		fs.readFile("./server/data/over-drive.json", 'utf8', function (err, data) {
			// if no error 
			if(!err) {
				// send data
				res.end( data );
			}
			else {
				// send internal error
				res.status(500).send({message: "Something went wrong. " + err.message});
			}
		});
	}
	else {
		// send bad request
		res.status(400).send({message: "Bad request. Please pass in a query parameter with a subportfolio identifier."});
	}
});

// GET blog page information
// format /api/blog
router.get('/api/blog', function (req, res, next) {
	fs.readFile("./server/data/blog.json", 'utf8', function (err, data) {
		// if no error 
		if(!err) {
			// send data
			res.end( data );
		}
		else {
			// send internal error
			res.status(500).send({message: "Something went wrong. " + err.message});
		}
	});
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
			res.status(500).send({message: "Something went wrong. " + err.message});
		}
	});
});

/*
	POST
*/

module.exports = router;