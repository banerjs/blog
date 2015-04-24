var gulp = require('gulp');
var gulpif = require('gulp-if');
var concat = require('gulp-concat');
var streamify = require('gulp-streamify');
var gutil = require('gulp-util');
var notify = require('gulp-notify');

var watchify = require('watchify');

var browserify = require('browserify');
var reactify = require('reactify');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');

var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var nano = require('gulp-cssnano');
var sass = require('gulp-sass');
var autoprefixer = require('autoprefixer-core')

// Goals of gulp:
// 1. In dev mode recreate build files as and when dependencies are updated
// 2. JSX -> jsxhint -> reactify -> uglify (if !dev)
// 3. CSS -> sass -> autoprefixer -> nano (if !dev)

var handleError = function(task) {
	return function(errr) {
		notify.onError({
			message: task + ' failed, check the logs...',
			sound: false
		})(err);

		gutil.log(gutil.colors.bgRed(task + ' error:'), gutil.colors.red(err));
	};
}

// FIXME: Make sure that this is expected
var production = process.env.NODE_ENV === 'production' ? true : false;

// Define the subtasks that are needed by the app
var tasks = {
	// Delete the build folder
	clean: function(cb) {
		del(['build/*'], cb);
	},

	// Copy static files - images, favicon, etc.
	assets: function() {
		// TODO
	},

	// HTML
	templates: function() {
		// FIXME: Figure out the paths
		gulp.src('*.html')
			.pipe(gulp.dest('build/'));
	},

	// SASS
	sass: function() {
		var start = new Date();
		// FIXME: Figure out the paths
		return gulp.src('*.scss')
					// Source maps + sass + error handling
					.pipe(gulpif(!production, sourcemaps.init())) // Problems!!!
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
					.pipe(gulp.dest('build/css/'))
					.pipe(notify(function() {
						console.log('SASS bundle built in ' + (Date.now() - start) + 'ms');
					}));
	},

	// Browserify
	browserify: function() {
		// FIXME: Figure out the paths
		var bundler = browserify({
			entries: './bin/www',
			transform: [reactify]
			debug: !production,
			fullPaths: !production,
			cache: {}, packageCache: {} // apparently needed for watchify
		});

		// TODO: Might need to do something fancy with external libs like react
		// and react-router

		if (!production) {
			bundler = watchify(bundler);
		}

		var rebundle = function() {
			var start = new Date();
			return bundler.bundle()
							.on('error', handleError('Browserify'))
							.pipe(source('main.js')) // FIXME: Figure out the paths
							.pipe(gulpif(production, streamify(uglify())))
							.pipe(gulp.dest('build/js/'))
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
		// FIXME: Figure out the paths
		return gulp.src(['*.js', '*.jsx'])
					.pipe(jshint({ linter: 'jsxhint' }))
					.pipe(jshint.reporter(stylish))
					.on('error', handleError('JSHint'));
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
// Require a clean for all tasks in production
var req = production ? ['clean'] : [];
// other tasks
gulp.task('templates', req, tasks.templates);
gulp.task('assets', req, tasks.assets);
gulp.task('sass', req, tasks.sass);
gulp.task('browserify', req, tasks.browserify);
gulp.task('optimize', req, tasks.optimize);
gulp.task('lint:js', tasks.lintjs);
gulp.task('test', tasks.test);

// Macro tasks
gulp.task('deploy', [
	'clean',
	'templates',
	'assets',
	'sass',
	'browserify'
]);

gulp.task('watch', ['templates', 'assets', 'sass', 'lint:js', 'browserify'], function() {
	gulp.watch('*.scss', ['sass']);
	gulp.watch(['*.js', '*.jsx'], ['lint:js']); // Assuming that watchify will build
});

gulp.task('default', ['watch']);
