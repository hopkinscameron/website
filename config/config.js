'use strict';

/**
 * Module dependencies.
 */
var // lodash
    _ = require('lodash'),
    // clc colors for console logging
	clc = require('./lib/clc'),
    // glob for path/pattern matching
    glob = require('glob'),
    // the file system to read/write from/to files locally
    fs = require('fs'),
    // path
    path = require('path');

/**
 * Get files by glob patterns
 */
var getGlobbedPaths = function (globPatterns, excludes) {
	// URL paths regex
	var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

	// The output array
	var output = [];

	// If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
	if (_.isArray(globPatterns)) {
		globPatterns.forEach(function (globPattern) {
			output = _.union(output, getGlobbedPaths(globPattern, excludes));
		});
	} 
	else if (_.isString(globPatterns)) {
		if (urlRegex.test(globPatterns)) {
			output.push(globPatterns);
		} 
		else {
			var files = glob.sync(globPatterns);
			if (excludes) {
				files = files.map(function (file) {
					if (_.isArray(excludes)) {
						for (var i in excludes) {
							if (excludes.hasOwnProperty(i)) {
								file = file.replace(excludes[i], '');
							}
						}
					} 
					else {
						file = file.replace(excludes, '');
					}
					return file;
				});
			}
			output = _.union(output, files);
		}
	}

	return output;
};

/**
 * Validate NODE_ENV existence
 */
var validateEnvironmentVariable = function () {
    // get the environment files
    var environmentFiles = glob.sync('./config/env/' + process.env.NODE_ENV + '.js');

    // if no environment files were found
    if (!environmentFiles.length) {
        // if node environment was found
        if (process.env.NODE_ENV) {
            console.error(clc.error('+ Error: No configuration file found for "' + process.env.NODE_ENV + '" environment using development instead'));
        } 
        else {
            console.error(clc.error('+ Error: NODE_ENV is not defined! Using default development environment'));
        }

        // set default to development
        process.env.NODE_ENV = 'development';
    }

    // reset console color
    console.log(clc.default(''));
};

/** 
 * Validate config.domain is set
 */
var validateDomainIsSet = function (config) {
    // if the domain has not been set yet
    if (!config.domain) {
        console.log(clc.error('+ Important warning: config.domain is empty. It should be set to the fully qualified domain of the app.'));
    }
};

/**
 * Validate Secure=true parameter can actually be turned on
 * because it requires certs and key files to be available
 */
var validateSecureMode = function (config) {
    // if not running in secure mode
    if (!config.secure || config.secure.ssl !== true) {
        return true;
    }

    // get the private key and certificate
    var privateKey = fs.existsSync(path.resolve(config.secure.privateKey));
    var certificate = fs.existsSync(path.resolve(config.secure.certificate));

    // if private key or certificate was not found, log and set unsecure
    if (!privateKey || !certificate) {
        console.log(clc.error('+ Error: Certificate file or key file is missing, falling back to non-SSL mode'));
        console.log(clc.error('  To create them, simply run the following from your shell: sh ./scripts/generate-ssl-certs.sh'));
        console.log();
        config.secure.ssl = false;
    }
};

/**
 * Validate Session Secret parameter is not set to default in production
 */
var validateSessionSecret = function (config, testing) {
    // if not in production
	if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'developmentp') {
		return true;
	}

    // if the session secret is still the default
    if (config.sessionSecret === 'TEST') {
        // if not currently in testing
        if (!testing) {
            console.log(clc.error('+ WARNING: It is strongly recommended that you change sessionSecret config while running in production!'));
            console.log(clc.error('  Please add \'sessionSecret: process.env.SESSION_SECRET || \'super amazing secret\'\' to '));
            console.log(clc.error('  \'config/env/production.js\' or \'config/env/local.js\''));
            console.log();
        }

        return false;
    } 
    else {
        return true;
    }
};

/**
 * Initialize global configuration files
 */
var initGlobalConfigFolders = function (config, assets) {
    // appending files
    config.folders = {
        server: {},
        client: {}
    };

    // setting globbed client paths
    config.folders.client = getGlobbedPaths(path.join(process.cwd(), 'modules/*/client/'), process.cwd().replace(new RegExp(/\\/g), '/'));
};

/**
 * Initialize global configuration files
 */
function initGlobalConfigFiles(config, assets) {
	// appending files
	config.files = {
		server: {},
		client: {}
	};

	// setting globbed model files
	config.files.server.models = getGlobbedPaths(assets.server.models);

	// setting globbed route files
	config.files.server.routes = getGlobbedPaths(assets.server.routes);

	// setting globbed config files
	config.files.server.configs = getGlobbedPaths(assets.server.config);

	// setting globbed socket files
	config.files.server.sockets = getGlobbedPaths(assets.server.sockets);

	// setting globbed policies files
	config.files.server.policies = getGlobbedPaths(assets.server.policies);

	// setting globbed js files
	config.files.client.js = getGlobbedPaths(assets.client.lib.js, 'public/').concat(getGlobbedPaths(assets.client.js, ['public/']));

	// setting globbed css files
	config.files.client.css = getGlobbedPaths(assets.client.lib.css, 'public/').concat(getGlobbedPaths(assets.client.css, ['public/']));

	// setting globbed test files
	config.files.client.tests = getGlobbedPaths(assets.client.tests);
};

/**
 * Initialize global configuration
 */
var initGlobalConfig = function () {
    // validate NODE_ENV existence
    validateEnvironmentVariable();

    // get the default assets
    var defaultAssets = require(path.join(process.cwd(), 'config/assets/default'));

    // get the current assets
    var environmentAssets = require(path.join(process.cwd(), 'config/assets/', process.env.NODE_ENV)) || {};

    // merge assets
    var assets = _.merge(defaultAssets, environmentAssets);

    // det the default config
    var defaultConfig = require(path.join(process.cwd(), 'config/env/default'));

    // get the current config
    var environmentConfig = require(path.join(process.cwd(), 'config/env/', process.env.NODE_ENV)) || {};

    // merge config files
    var config = _.merge(defaultConfig, environmentConfig);

    // read package.json for MEAN.JS project information
    var pkg = require(path.resolve('./package.json'));
    
    // set the personal website package
    config.personalWebsite = pkg;

    // extend the config object with the local-NODE_ENV.js custom/local environment. This will override any settings present in the local configuration.
    config = _.merge(config, (fs.existsSync(path.join(process.cwd(), 'config/env/local-' + process.env.NODE_ENV + '.js')) && require(path.join(process.cwd(), 'config/env/local-' + process.env.NODE_ENV + '.js'))) || {});

    // initialize global globbed files
    initGlobalConfigFiles(config, assets);

    // initialize global globbed folders
    initGlobalConfigFolders(config, assets);

    // validate Secure SSL mode can be used
    validateSecureMode(config);

    // validate session secret
    validateSessionSecret(config);

    // print a warning if config.domain is not set
    validateDomainIsSet(config);

    // expose configuration utilities
    config.utils = {
        getGlobbedPaths: getGlobbedPaths,
        validateSessionSecret: validateSessionSecret
    };

    return config;
};

/**
 * Set configuration object
 */
module.exports = initGlobalConfig();