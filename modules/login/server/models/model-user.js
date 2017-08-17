'use strict';
/**
 *  Name: The User Schema
    Description: Determines how a user is defined
 */

/**
 * Module dependencies
 */
var  // the path
    path = require('path'),
    // get the default config
	defaultConfig = require(path.resolve('./config/env/default')),
    // the communication to mongo database
    mongoose = require('mongoose'),
    // the scheme for mongoose/mongodb
    Schema = mongoose.Schema,
    // bcrypt for cryptography
    bcrypt = require('bcryptjs'),
    // validator
    validator = require('validator')

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function (property) {
  return (this.provider !== 'local' && !this.updated) || property.length;
};

/**
 * A Validation function for local strategy email
 */
var validateLocalStrategyEmail = function (email) {
  return (this.provider !== 'local' && !this.updated) || validator.isEmail(email, { require_tld: false });
};

/**
 * A Validation function for username
 * - at least 3 characters
 * - only a-z0-9_-.
 * - contain at least one alphanumeric character
 * - not in list of illegal usernames
 * - no consecutive dots: "." ok, ".." nope
 * - not begin or end with "."
 */
var validateUsername = function(username) {
  var usernameRegex = /^(?=[\w.-]+$)(?!.*[._-]{2})(?!\.)(?!.*\.$).{3,34}$/;
  return this.provider !== 'local' || (username && usernameRegex.test(username));
};

/**
 * User Schema
 */ 
var UserSchema = new Schema({
    username: { 
        type: String,
        unique: 'Username already exists',
        required: 'Please fill in a username',
        validate: [validateUsername, 'Please enter a valid username: 3+ characters long, non restricted word, characters "_-.", no consecutive dots, does not begin or end with dots, letters a-z and numbers 0-9.'],
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    passwordUpdatedLast: {
        type: Date,
        required: true
    },
    lastLogin: {
        type: Date
    }
});

// function that is called before saving to database
UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) {
        return next();
    } 

    // generate a salt
    bcrypt.genSalt(defaultConfig.saltRounds, function(err, salt) {
        // if error occurred
        if (err) {
            return next(err);
        }

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            // if error occurred
            if (err) {
                return next(err);
            } 

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

// compares passwords
UserSchema.methods.comparePassword = function(plainTextPassword, cb) {
    bcrypt.compare(plainTextPassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

// specify the transform schema option
if (!UserSchema.options.toObject) {
    UserSchema.options.toObject = {};
}

// set options for returning an object
UserSchema.options.toObject.transform = function (doc, ret, options) {
    // if hide options
    if (options.hide) {
        // go through each option and remove
        options.hide.split(' ').forEach(function (prop) {
            delete ret[prop];
        });
    }

    // always hide the id and version
    //delete ret['_id'];
    delete ret['__v'];

    // return object
    return ret;
};

// export for other uses
module.exports = mongoose.model('User', UserSchema);