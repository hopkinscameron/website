/*
var gulp = require('gulp');
var shell = require('gulp-shell')
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
*/

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	fs = require('fs'),
	defaultAssets = require('./config/assets/default'),
	glob = require('glob'),
	gulp = require('gulp'),
	gulpLoadPlugins = require('gulp-load-plugins'),
	runSequence = require('run-sequence'),
	plugins = gulpLoadPlugins({
		rename: {
			'gulp-angular-templatecache': 'templateCache'
		}
	}),
	wiredep = require('wiredep').stream,
	path = require('path'),
	del = require('del'),
	semver = require('semver');

// Local settings
var changedTestFiles = [];

var paths = {
	'src':['package.json'],
	'style': {
		all: './modules/core/client/css/**/*.scss',
		output: './modules/core/client/css/'
	}
};

/*
// task for sass file changes
gulp.task('watch:sass', function () {
	gulp.watch(paths.style.all, ['sass']);
});

// task to compile sass
gulp.task('sass', function() {
	gulp.src(paths.style.all)
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(paths.style.output));
});

// gulp watch tasks
gulp.task('watch', ['watch:sass',]);

// the default task (called when you run 'gulp' from cli)
gulp.task('default', ['watch', 'sass']);

// TODO: later to uglyify
//gulp.task('default', ['watch', 'scripts']);
*/

// Set NODE_ENV to 'development'
gulp.task('env:dev', function () {
	process.env.NODE_ENV = 'development';
});

// Set NODE_ENV to 'production'
gulp.task('env:prod', function () {
	process.env.NODE_ENV = 'production';
});

// Copy local development environment config example
gulp.task('copyLocalEnvConfig', function () {
	var src = [];
	var renameTo = 'local-development.js';

	// only add the copy source if our destination file doesn't already exist
	if (!fs.existsSync('config/env/' + renameTo)) {
		src.push('config/env/local.example.js');
	}

	return gulp.src(src)
	.pipe(plugins.rename(renameTo))
	.pipe(gulp.dest('config/env'));
});

// Sass task
gulp.task('sass', function () {
  return gulp.src(defaultAssets.client.sass)
    .pipe(plugins.sass())
    .pipe(plugins.autoprefixer())
    .pipe(gulp.dest('./modules/core/client/css/'));
});

// Nodemon task
gulp.task('nodemon', function () {
	// Node.js v7 and newer use different debug argument
	var debugArgument = semver.satisfies(process.versions.node, '>=7.0.0') ? '--inspect' : '--debug';

	return plugins.nodemon({
		script: 'server.js',
		nodeArgs: [debugArgument],
		ext: 'js,html',
		verbose: true,
		watch: _.union(defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config)
	});
});

// Nodemon task without verbosity or debugging
gulp.task('nodemon-nodebug', function () {
	return plugins.nodemon({
		script: 'server.js',
		ext: 'js,html',
		watch: _.union(defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config)
	});
});

// Watch Files For Changes
gulp.task('watch', function () {
	// Start livereload
	plugins.refresh.listen();

	// Add watch rules
	gulp.watch(defaultAssets.server.views).on('change', plugins.refresh.changed);
	gulp.watch(defaultAssets.client.sass, ['sass']).on('change', plugins.refresh.changed);

	if (process.env.NODE_ENV === 'production') {
		gulp.watch(defaultAssets.server.gulpConfig, ['templatecache', 'eslint']);
		gulp.watch(defaultAssets.client.views, ['templatecache']).on('change', plugins.refresh.changed);
	} 
	else {
		gulp.watch(defaultAssets.client.views).on('change', plugins.refresh.changed);
	}
});

// Run the project in production mode
gulp.task('prod', function (done) {
	runSequence(['copyLocalEnvConfig', 'templatecache'], 'build', 'env:prod', 'lint', ['nodemon-nodebug', 'watch'], done);
});

// Run the project in development mode with node debugger enabled
gulp.task('default', function (done) {
	runSequence('env:dev', ['copyLocalEnvConfig'], ['nodemon', 'watch'], done);
});