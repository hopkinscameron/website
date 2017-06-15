var gulp = require('gulp');
var shell = require('gulp-shell')
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');

var paths = {
	'src':['package.json'],
	'style': {
		all: './client/styles/**/*.scss',
		output: './client/styles/'
	}
};

// task for sass file changes
gulp.task('watch:sass', function () {
	gulp.watch(paths.style.all, ['sass']);
});

// task to compile sass
gulp.task('sass', function(){
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