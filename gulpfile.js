var gulp = require('gulp');
var gulpConcat = require('gulp-concat');
var merge = require('merge-stream');
var jshint = require('gulp-jshint');
var csshint = require('gulp-stylelint');
var uglify = require('gulp-uglify');
var uglifyCSS = require('gulp-uglifycss');
var del = require('del');
var pump = require('pump');
var ava = require('gulp-ava');
var vinylPaths = require('vinyl-paths');
var babel = require('gulp-babel');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');

gulp.task('lint-js', function(done) {
	pump([
		gulp.src('./src/js/*.js'),
		jshint(),
		jshint.reporter('jshint-stylish')
	], done);
});

gulp.task('test', function(done) {
	pump([
		gulp.src('./test/*.js'),
		ava({
			verbose: true
		})
	], done);
});

gulp.task('clean-js', function(done) {
	pump([
		gulp.src('./dist/js/*'),
		vinylPaths(del)
	], done);
});

gulp.task('concat-js', function(done) {
	/*var browserifyResult = browserify({
		entries: './src/js/App.js',
		debug: true
	});*/

	return browserify({
			entries: './src/js/App.js',
			debug: true,
			transform: [
				babelify.configure({
					presets: [
						['es2015']
					]
				})
			]
		})
		.bundle()
		.on('error', gutil.log)
		.pipe(source('all.js'))
		.pipe(buffer())
		.pipe(gulp.dest('./dist/js/transpiled'));

	/*return merge(
		browserifyResult
		.bundle()
		.on('error', gutil.log)
		.pipe(source('all.js'))
		.pipe(gulp.dest('./dist/js')),

		browserifyResult
		.transform('babelify', { presets: ['env', 'es2015'] })
		.on('error', gutil.log)
		.bundle()
		.pipe(source('all.js'))
		.pipe(buffer())
		.pipe(gulp.dest('./dist/js/transpiled'))
	);*/
});

gulp.task('uglify-js', function(done) {
	pump([
		gulp.src('./dist/js/transpiled/*.js'),
		uglify(),
		gulp.dest('./dist/js/min/')
	], done);
});

gulp.task('watch-js', function() {
	gulp.watch('./src/js/**/*.js', gulp.series('js'));
});

gulp.task('lint-css', function(done) {
	pump([
		gulp.src('./src/css/*.css'),
		csshint({
			reporters: [{
				formatter: 'string',
				console: true
			}],
			//fix: true
		}),
		//gulp.dest('./src/')
	], done);
});

gulp.task('clean-css', function(done) {
	pump([
		gulp.src('./dist/css/*'),
		vinylPaths(del)
	], done);
});

gulp.task('concat-css', function(done) {
	pump([
		gulp.src('./src/css/*.css'),
		gulpConcat('all.css'),
		gulp.dest('./dist/css/')
	], done);
});

gulp.task('uglify-css', function(done) {
	pump([
		gulp.src('./dist/css/*.css'),
		uglifyCSS({
			"maxLineLen": 80,
			"uglyComments": true
		}),
		gulp.dest('./dist/css/min/')
	], done);
});

gulp.task('js', gulp.series( /*'lint-js',*/ 'test', 'clean-js', 'concat-js', 'uglify-js'));
gulp.task('css', gulp.series( /*'lint-css',*/ 'clean-css', 'concat-css', 'uglify-css'));

gulp.task('default', gulp.parallel('js', 'css'));