var gulp = require('gulp');
var gulpif = require('gulp-if');
var streamify = require('gulp-streamify');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var notify = require('gulp-notify');

var watchify = require('watchify');
var del = require('del');

var babel = require('gulp-babel');

var browserify = require('browserify');
var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');

var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var nano = require('gulp-cssnano');
var sass = require('gulp-sass');
var autoprefixer = require('autoprefixer')

// Define all the vendor libs that don't really change all that much. Be careful
// though. According to https://github.com/vigetlabs/gulp-starter/issues/75,
// there could be issues with vendor dependencies if they're not fully specified
// in this list.
var vendors = [
	'jquery',
	'fullpage.js'
]

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

// Figure out if this is going to be a production build
var production = (process.env.NODE_ENV === 'production'
				  || (!!process.argv.length && process.argv[process.argv.length-1] === "deploy"));

// Then try to determine if this is a build requiring hot reload
var watch = !production && (!!process.argv.length && process.argv[process.argv.length-1] !== "build");

// Define the subtasks that are needed by the app
var tasks = {
	// Delete the build folder
	clean: function(cb) {
		del(['public/*', 'build/*'], cb);
	},

	// Copy static files - images, favicon, etc.
	// Assumption: there will never be assets folders with the names css and js
	assets: function() {
		return gulp.src('./assets/**')
					.pipe(gulp.dest('public/'));
	},

	// Templates
	templates: function() {
		return gulp.src('./src/templates/**/*.html')
					.pipe(gulp.dest('build/templates/'));
	},

	// SASS
	sass: function() {
		var start = new Date();
		return gulp.src(['./src/css/**/*.scss', './src/css/**/*.css'])
					// Source maps + sass + error handling
					.pipe(gulpif(!production, sourcemaps.init()))
					.pipe(sass({
						sourceComments: !production,
						outputStyle: (production) ? 'compressed' : 'nested'
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

	// JSX Transform
	reactify: function() {
		return gulp.src(['./src/**/*.js', './src/**/*.jsx'])
					.pipe(babel({
						presets: ['react']
					}))
					.pipe(gulp.dest('build/'));
	},

	// Browserify
	browserify: function() {
		var bundler = browserify({
			entries: './build/clientRouter.js',
			debug: !production,
			fullPaths: !production,
			cache: {}, packageCache: {} // apparently needed for watchify
		});

		if (watch) {
			bundler = watchify(bundler, { delay: 8000 }); // Give reactify time
		}

		var rebundle = function() {
			var start = new Date();
			console.log('APP bundle started at ' + start);
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

	// Test
	test: function() {
		// TODO
	}
};

// Mini tasks
gulp.task('clean', tasks.clean);
gulp.task('assets', tasks.assets);
gulp.task('sass', tasks.sass);
gulp.task('templates', tasks.templates);
gulp.task('reactify', ['templates'], tasks.reactify);
gulp.task('browserify', ['reactify'], tasks.browserify);
gulp.task('optimize', tasks.optimize);
gulp.task('lint:js', tasks.lintjs);
gulp.task('test', tasks.test);

// Macro tasks

// This is the main task for production - deploys the code with minification
gulp.task('deploy', [
	'assets',
	'sass',
	'templates',
	'browserify'
]);

// Unlike deploy which is production ready, this command builds with source maps
gulp.task('build', ['deploy']);

// While developing, this is perhaps the most useful for small changes. Larger
// changes might cause compilation errors and should thus be avoided
gulp.task('watch', ['deploy'], function() {
	gulp.watch('./src/**/*.scss', ['sass']);
	gulp.watch('./assets/**', ['assets']);
	gulp.watch('./src/templates/**/*.html', ['templates']);
	gulp.watch([
		'./src/**/*.js',
		'./src/**/*.jsx'
	], ['reactify']);
});

// Set the default task for gulp to be the watch
gulp.task('default', ['watch']);
