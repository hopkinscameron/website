/**
 * Module dependencies.
 */
var // lodash
	_ = require('lodash'),
	// the file system to read/write from/to files locally
	fs = require('fs'),
	// the default application assets
	defaultAssets = require('./config/assets/default'),
	// glob for path/pattern matching
	glob = require('glob'),
	// gulp for pre processing tasks
	gulp = require('gulp'),
	// loading all gulp plugins
	gulpLoadPlugins = require('gulp-load-plugins'),
	// to run a sequence of gulp tasks
	runSequence = require('run-sequence'),
	// loading all plugins
	plugins = gulpLoadPlugins({
		rename: {
			'gulp-angular-templatecache': 'templateCache',
			'gulp-strip-comments': 'strip',
			'gulp-htmlmin': 'minifyHTML'
		}
	}),
	// pngquant for image compression
	pngquant = require('imagemin-pngquant'),
	// wiredep for dependence injections
	wiredep = require('wiredep').stream,
	// path
	path = require('path'),
	// use to know when end of the line
	endOfLine = require('os').EOL,
	// for deleting directories and objects
	del = require('del'),
	// for versioning
	semver = require('semver');

// set NODE_ENV to 'development'
gulp.task('env:dev', function () {
	process.env.NODE_ENV = 'development';
});

// set NODE_ENV to 'production'
gulp.task('env:prod', function () {
	process.env.NODE_ENV = 'production';
});

// set NODE_ENV to 'unsecure production'
gulp.task('env:uprod', function () {
	process.env.NODE_ENV = 'uproduction';
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

// copy copy over server index files
gulp.task('copyindexviews', function () {
	// index directory
	var dir ='modules/core/server/index';

	// delete first then move on
	del.sync([dir]);

	// make directory for the index files
	fs.mkdirSync(dir);

	return gulp.src(defaultAssets.server.index)
		.pipe(plugins.minifyHTML({
			collapseBooleanAttributes: true,
			collapseInlineTagWhitespace: true,
			collapseWhitespace: true,
			ignoreCustomFragments: [/{{([^{}]+)}}/],
			minifyCSS: true,
			minifyJS: true,
			preserveLineBreaks: false,
			processScripts: ['text/html', 'text/ng-template', 'text/x-handlebars-template'],
			removeComments: true,
			removeEmptyAttributes: true
		}))
		.pipe(gulp.dest(dir));
});

// CSS linting task
gulp.task('csslint', function () {
	return gulp.src(defaultAssets.client.css)
		.pipe(plugins.csslint('.csslintrc'))
		.pipe(plugins.csslint.formatter());
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

	// delete first then move on
	del.sync(['public/dist/cameronhopkins*']);

	return gulp.src(assets)
		.pipe(plugins.ngAnnotate())
		.pipe(plugins.uglify({
			mangle: false
		}))
		.pipe(plugins.concat('cameronhopkins.min.js'))
		//.pipe(plugins.rev())
		.pipe(gulp.dest('public/dist'));
});

// copy fonts to public folder
gulp.task('copyfonts', function () {
	// fonts directory
	var dir ='public/dist/fonts';

	// delete first then move on
	del.sync([dir]);

	// make directory for the fonts
	//fs.mkdirSync(dir);

	return gulp.src(defaultAssets.client.fonts)
		.pipe(plugins.rename({ dirname: '' }))
		.pipe(gulp.dest(dir));
});

// copy files to public folder
gulp.task('copyfiles', function () {
	// files directory
	var dir ='public/dist/files';

	// delete first then move on
	del.sync([dir]);

	// make directory for the files
	//fs.mkdirSync(dir);

	return gulp.src(defaultAssets.client.files)
		.pipe(plugins.rename({ dirname: '' }))
		.pipe(gulp.dest(dir));
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

// CSS minifying task
gulp.task('cssmin', function () {
	return gulp.src(defaultAssets.client.css)
		.pipe(plugins.csso({
            restructure: false,
            sourceMap: true
        }))
		.pipe(plugins.concat('cameronhopkins.min.css'))
		//.pipe(plugins.rev())
		.pipe(gulp.dest('public/dist'));
});

// imagemin task and copy to public folder
gulp.task('imagemin', function () {
	return gulp.src(defaultAssets.client.img)
		.pipe(plugins.imagemin({
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }],
			use: [pngquant()]
		}))
		.pipe(plugins.rename({ dirname: '' }))
		.pipe(gulp.dest('public/dist/img'));
});
	
// copy images to public folder
gulp.task('copyimages', function () {
	// images directory
	var dir ='public/dist/img';

	// delete first then move on
	del.sync([dir]);

	// make directory for the images
	//fs.mkdirSync(dir);

	return gulp.src(defaultAssets.client.img)
		.pipe(plugins.rename({ dirname: '' }))
		.pipe(gulp.dest(dir));
});

// copy icons to public folder
gulp.task('copyicons', function () {
	// images directory
	var dir ='public/dist/img';

	// if the directory doesn't exists
	if (!fs.existsSync(dir)) {
		// make directory for the icons
		//fs.mkdirSync(dir);
	}

	return gulp.src(defaultAssets.client.icons)
		.pipe(plugins.rename({ dirname: '' }))
		.pipe(gulp.dest(dir));
});

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
		.pipe(plugins.strip())
		.pipe(plugins.templateCache('templates.js', {
			root: '/modules/',
			module: 'core',
			templateHeader: '\'use strict\';' + endOfLine + endOfLine + 'var coreModule = angular.module(\'<%= module %>\'<%= standalone %>);' + endOfLine + endOfLine +  'coreModule.run([\'$templateCache\', function($templateCache) {' + endOfLine,
			templateBody: '    $templateCache.put(\'<%= url %>\', \'<%= contents %>\');',
			templateFooter: endOfLine + '}]);'
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
	gulp.watch(defaultAssets.server.allJS).on('change', plugins.refresh.changed);
	gulp.watch(defaultAssets.client.js).on('change', plugins.refresh.changed);
	gulp.watch(defaultAssets.client.css).on('change', plugins.refresh.changed);
	gulp.watch(defaultAssets.client.sass, ['sass']).on('change', plugins.refresh.changed);
	
	// MEAN
	/*
	gulp.watch(defaultAssets.server.allJS, ['eslint']).on('change', plugins.refresh.changed);
	gulp.watch(defaultAssets.client.js, ['eslint']).on('change', plugins.refresh.changed);
	gulp.watch(defaultAssets.client.css, ['csslint']).on('change', plugins.refresh.changed);
	gulp.watch(defaultAssets.client.sass, ['sass', 'csslint']).on('change', plugins.refresh.changed);
	gulp.watch(defaultAssets.client.less, ['less', 'csslint']).on('change', plugins.refresh.changed);
	*/

	// if in production, watch for templatecache
	if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'uproduction') {
		//gulp.watch(defaultAssets.server.gulpConfig, ['templatecache', 'eslint']);
		gulp.watch(defaultAssets.server.gulpConfig, ['templatecache']);
		gulp.watch(defaultAssets.client.views, ['templatecache', 'uglify', 'cssmin']).on('change', plugins.refresh.changed);
	} 
	else {
		gulp.watch(defaultAssets.client.views).on('change', plugins.refresh.changed);
	}
});

// lint CSS and JavaScript files.
gulp.task('lint', function (done) {
	//runSequence('less', 'sass', ['csslint', 'eslint'], done);
	//runSequence('sass', ['csslint', 'eslint'], done);
	runSequence('sass', done);
});

// lint project files and minify them into two production files.
// add the custom fonts to the files
gulp.task('build', function (done) {
  	runSequence('env:dev', 'copyindexviews', 'wiredep:prod', 'lint', ['uglify', 'cssmin'/*, 'copyfonts', 'copyfiles'*/]/*, 'imagemin', 'copyicons'*/, done);
});

// run the build:dev version
gulp.task('build:dev', function (done) {
  	runSequence(['copyfonts', 'copyfiles'], 'copyimages', 'copyicons', done);
});

// run the project in production mode
gulp.task('prod', function (done) {
	runSequence(['copyLocalEnvConfig', 'templatecache'], 'build', 'env:prod', 'lint', ['nodemon-nodebug', 'watch'], done);
});

// run the project in unsecure production mode
gulp.task('uprod', function (done) {
	runSequence(['copyLocalEnvConfig', 'templatecache'], 'build', 'env:uprod', 'lint', ['nodemon-nodebug', 'watch'], done);
});

// run the project in development mode with node debugger enabled
gulp.task('default', function (done) {
	//runSequence('env:dev', ['copyLocalEnvConfig'], 'lint', ['nodemon', 'watch'], done);
	runSequence('env:dev', ['copyLocalEnvConfig'], 'sass', 'build:dev', ['nodemon', 'watch'], done);
});