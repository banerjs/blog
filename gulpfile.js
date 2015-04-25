var gulp = require('gulp');
var gulpif = require('gulp-if');
var concat = require('gulp-concat');
var streamify = require('gulp-streamify');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var notify = require('gulp-notify');

var watchify = require('watchify');
var del = require('del');

var browserify = require('browserify');
var reactify = require('reactify');
var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');

var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var nano = require('gulp-cssnano');
var sass = require('gulp-sass');
var autoprefixer = require('autoprefixer-core')

// Define task helper variables and functions
var handleError = function(task) {
	return function(err) {
		notify.onError({
			message: task + ' failed, check the logs...',
			sound: false
		})(err);

		gutil.log(gutil.colors.bgRed(task + ' error:'), gutil.colors.red(err));
	};
}

var production = (process.env.NODE_ENV === 'production'
				  || (!!process.argv.length && process.argv[process.argv.length-1] === "deploy"));

// Define the subtasks that are needed by the app
var tasks = {
	// Delete the build folder
	clean: function(cb) {
		del(['public/*'], cb);
	},

	// Copy static files - images, favicon, etc.
	assets: function() {
		return gulp.src('./assets/**')
					.pipe(gulp.dest('public/'));
	},

	// SASS
	sass: function() {
		var start = new Date();
		return gulp.src(['./src/css/**/*.scss', './src/css/**/*.css'])
					// Source maps + sass + error handling
					.pipe(gulpif(!production, sourcemaps.init()))
					.pipe(sass({
						sourceComments: !production,
						outputStyle: 'nested'
					}))
					.on('error', handleError('SASS'))
					// generate .maps for debugging
					.pipe(gulpif(!production, sourcemaps.write({
						'includeContent': false,
						'sourceRoot': '.'
					})))
					.pipe(gulpif(!production, sourcemaps.init({
						'loadMaps': true
					})))
					// autoprefixer
					.pipe(postcss([autoprefixer({browsers: ['> 5%', 'last 2 versions']})]))
					// Minify
					.pipe(nano())
					// include the source maps in the files if generated
					.pipe(sourcemaps.write({
						'includeContent': true
					}))
					// Save the CSS files to a build directory and notify
					.pipe(gulp.dest('public/css/'))
					.pipe(notify(function() {
						console.log('SASS bundle built in ' + (Date.now() - start) + 'ms');
					}));
	},

	// Browserify
	browserify: function() {
		var bundler = browserify({
			entries: './src/routes.js',
			transform: [reactify],
			debug: !production,
			fullPaths: !production,
			cache: {}, packageCache: {} // apparently needed for watchify
		});

		if (!production) {
			bundler = watchify(bundler);
		}

		var rebundle = function() {
			var start = new Date();
			return bundler.bundle()
							.on('error', handleError('Browserify'))
							.pipe(source('application.js'))
							.pipe(gulpif(production, streamify(uglify())))
							.pipe(gulp.dest('public/js/'))
							.pipe(notify(function() {
								console.log('APP bundle built in ' + (Date.now() - start) + 'ms');
							}));
		}

		// Only fires if watchify is wrapped around bundle
		bundler.on('update', rebundle);
		return rebundle();
	},

	// Lint JSX, JS
	lintjs: function() {
		var start = new Date();
		return gulp.src([
			'./src/**/*.js',
			'./src/**/*.jsx',
			'./app.js',
			'./bin/www'
			])
			.pipe(eslint())
			.pipe(eslint.format())
			.pipe(eslint.failOnError());
	},

	// Optimize Assets
	optimize: function() {
		// TODO
	},

	// Test
	test: function() {
		// TODO
	}
};

// TODO: Install BrowserSync?

// Mini tasks
gulp.task('clean', tasks.clean);
gulp.task('assets', tasks.assets);
gulp.task('sass', tasks.sass);
gulp.task('browserify', tasks.browserify);
gulp.task('optimize', tasks.optimize);
gulp.task('lint:js', tasks.lintjs);
gulp.task('test', tasks.test);

// Macro tasks
gulp.task('deploy', [
	'clean',
	'assets',
	'sass',
	'browserify'
]);

gulp.task('strict', ['assets', 'sass', 'lint:js', 'browserify'], function() {
	gulp.watch('./src/**/*.scss', ['sass']);
	gulp.watch([
		'./src/**/*.js',
		'./src/**/*.jsx',
		'./app.js'
	], ['lint:js', 'browserify']);
	gulp.watch('./assets/**', ['assets']);
});

gulp.task('watch', ['assets', 'sass', 'browserify'], function() {
	gulp.watch('./src/**/*.scss', ['sass']);
	gulp.watch('./assets/**', ['assets']);
	gulp.watch([
		'./src/**/*.js',
		'./src/**/*.jsx',
		'./app.js'
	], ['browserify']);
});

gulp.task('default', ['watch']);
