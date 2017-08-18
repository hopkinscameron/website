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
  	//pngquant = require('imagemin-pngquant'),
	wiredep = require('wiredep').stream,
	path = require('path'),
  	endOfLine = require('os').EOL,
	del = require('del'),
	semver = require('semver');

/*
var paths = {
	'src':['package.json'],
	'style': {*/
		//all: './modules/core/client/css/**/*.scss',
		/*output: './modules/core/client/css/'
	}
};
*/

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

// 
//gulp.task('default', ['watch', 'scripts']);
*/

// set NODE_ENV to 'development'
gulp.task('env:dev', function () {
	process.env.NODE_ENV = 'development';
});

// set NODE_ENV to 'production'
gulp.task('env:prod', function () {
	process.env.NODE_ENV = 'production';
});

// copy local development environment config example
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

// CSS linting task
gulp.task('csslint', function () {
	return gulp.src(defaultAssets.client.css)
		.pipe(plugins.csslint('.csslintrc'))
		.pipe(plugins.csslint.formatter());
	// Don't fail CSS issues yet
	// .pipe(plugins.csslint.failFormatter());
});

// ESLint JS linting task
gulp.task('eslint', function () {
	var assets = _.union(
		defaultAssets.server.gulpConfig,
		defaultAssets.server.allJS,
		defaultAssets.client.js
	);

	return gulp.src(assets)
		.pipe(plugins.eslint())
		.pipe(plugins.eslint.format());
});

// JS minifying task
gulp.task('uglify', function () {
	var assets = _.union(
		defaultAssets.client.js,
		defaultAssets.client.templates
	);
	del(['public/dist/*']);

	return gulp.src(assets)
		.pipe(plugins.ngAnnotate())
		.pipe(plugins.uglify({
			mangle: false
		}))
		.pipe(plugins.concat('cameronhopkins.min.js'))
		.pipe(plugins.rev())
		.pipe(gulp.dest('public/dist'));
});

// CSS minifying task
gulp.task('cssmin', function () {
	return gulp.src(defaultAssets.client.css)
		.pipe(plugins.csso())
		.pipe(plugins.concat('cameronhopkins.min.css'))
		.pipe(plugins.rev())
		.pipe(gulp.dest('public/dist'));
});

// SASS task
gulp.task('sass', function () {
	return gulp.src(defaultAssets.client.sass)
		.pipe(plugins.sass())
		.pipe(plugins.autoprefixer())
		.pipe(gulp.dest('./modules/core/client/css/'));
});

/*
// Less task
gulp.task('less', function () {
	return gulp.src(defaultAssets.client.less)
		.pipe(plugins.less())
		.pipe(plugins.autoprefixer())
		.pipe(gulp.dest('./modules/'));
});
*/

/*
// imagemin task
gulp.task('imagemin', function () {
	return gulp.src(defaultAssets.client.img)
		.pipe(plugins.imagemin({
		progressive: true,
		svgoPlugins: [{ removeViewBox: false }],
		use: [pngquant()]
		}))
		.pipe(gulp.dest('public/dist/img'));
});
*/

// wiredep task to default
gulp.task('wiredep', function () {
	return gulp.src('config/assets/default.js')
		.pipe(wiredep({
		ignorePath: '../../'
		}))
		.pipe(gulp.dest('config/assets/'));
});

// wiredep task to production
gulp.task('wiredep:prod', function () {
	return gulp.src('config/assets/production.js')
		.pipe(wiredep({
			ignorePath: '../../',
			fileTypes: {
				js: {
				replace: {
					css: function (filePath) {
						var minFilePath = filePath.replace('.css', '.min.css');
						var fullPath = path.join(process.cwd(), minFilePath);
						if (!fs.existsSync(fullPath)) {
							return '\'' + filePath + '\',';
						} 
						else {
							return '\'' + minFilePath + '\',';
						}
					},
					js: function (filePath) {
						var minFilePath = filePath.replace('.js', '.min.js');
						var fullPath = path.join(process.cwd(), minFilePath);
						if (!fs.existsSync(fullPath)) {
							return '\'' + filePath + '\',';
						} 
						else {
							return '\'' + minFilePath + '\',';
						}
					}
				}
				}
			}
		}))
		.pipe(gulp.dest('config/assets/'));
});

// Angular template cache task
gulp.task('templatecache', function () {
	return gulp.src(defaultAssets.client.views)
		.pipe(plugins.templateCache('templates.js', {
			root: '/modules/',
			module: 'core',
			templateHeader: '(function () {' + endOfLine + '	\'use strict\';' + endOfLine + endOfLine + '	angular' + endOfLine + '		.module(\'<%= module %>\'<%= standalone %>)' + endOfLine + '		.run(templates);' + endOfLine + endOfLine + '	templates.$inject = [\'$templateCache\'];' + endOfLine + endOfLine + '	function templates($templateCache) {' + endOfLine,
			templateBody: '		$templateCache.put(\'<%= url %>\', \'<%= contents %>\');',
			templateFooter: '	}' + endOfLine + '})();' + endOfLine
		}))
		.pipe(gulp.dest('build'));
});

// nodemon task
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

// nodemon task without verbosity or debugging
gulp.task('nodemon-nodebug', function () {
	return plugins.nodemon({
		script: 'server.js',
		ext: 'js,html',
		watch: _.union(defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config)
	});
});

// watch files for changes
gulp.task('watch', function () {
	// start livereload
	plugins.refresh.listen();

	// add watch rules
	gulp.watch(defaultAssets.server.views).on('change', plugins.refresh.changed);
	gulp.watch(defaultAssets.server.allJS, ['eslint']).on('change', plugins.refresh.changed);
	gulp.watch(defaultAssets.client.js, ['eslint']).on('change', plugins.refresh.changed);
	//gulp.watch(defaultAssets.client.css, ['csslint']).on('change', plugins.refresh.changed);
	//gulp.watch(defaultAssets.client.sass, ['sass', 'csslint']).on('change', plugins.refresh.changed);
	//gulp.watch(defaultAssets.client.less, ['less', 'csslint']).on('change', plugins.refresh.changed);

	// if in production, watch for templatecache
	if (process.env.NODE_ENV === 'production') {
		gulp.watch(defaultAssets.server.gulpConfig, ['templatecache', 'eslint']);
		gulp.watch(defaultAssets.client.views, ['templatecache']).on('change', plugins.refresh.changed);
	} 
	else {
		gulp.watch(defaultAssets.client.views).on('change', plugins.refresh.changed);
	}
});

// Lint CSS and JavaScript files.
gulp.task('lint', function (done) {
	//runSequence('less', 'sass', ['csslint', 'eslint'], done);
	//runSequence('sass', ['csslint', 'eslint'], done);
	runSequence('sass', done);
});

// Lint project files and minify them into two production files.
gulp.task('build', function (done) {
  	runSequence('env:dev', 'wiredep:prod', 'lint', ['uglify', 'cssmin'], done);
});

// run the project in production mode
gulp.task('prod', function (done) {
	//runSequence(['copyLocalEnvConfig', 'templatecache'], 'build', 'env:prod', 'lint', ['nodemon-nodebug', 'watch'], done);
	runSequence(['copyLocalEnvConfig'], 'build', 'env:prod', 'lint', ['nodemon-nodebug', 'watch'], done);
});

// run the project in development mode with node debugger enabled
gulp.task('default', function (done) {
	//runSequence('env:dev', ['copyLocalEnvConfig'], 'lint', ['nodemon', 'watch'], done);
	runSequence('env:dev', ['copyLocalEnvConfig'], 'sass', ['nodemon', 'watch'], done);
});