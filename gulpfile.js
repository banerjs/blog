var autoprefixer = require('autoprefixer');
var babel = require('gulp-babel');
var browserify = require('browserify');
var del = require('del');
var envify = require('envify/custom');
var eslint = require('gulp-eslint');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-image');
var nano = require('gulp-cssnano');
var notify = require('gulp-notify');
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var watchify = require('watchify');

// Define all the vendor libs that don't really change all that much.
var packageJSON = require('./package.json');
var libs = [
	"auth0-lock",
	"debug",
    "fluxible",
    "hammerjs",
    "history",
    "jquery",
    "mousetrap",
    "object-assign",
    "promise",
    "react",
    "react-dom",
    "serialize-javascript"
];

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
	fonts: function() {
		return gulp.src('./assets/fonts/**')
					.pipe(gulp.dest('public/fonts/'));
	},

	images: function() {
		return gulp.src('./assets/images/**')
					.pipe(imagemin())
					.pipe(gulp.dest('public/images/'));
	},

	favicon: function() {
		return gulp.src('./assets/favicon.ico')
					.pipe(gulp.dest('public/'));
	},

	// HTML Templates
	templates: function() {
		return gulp.src('./src/templates/**/*.html')
					.pipe(gulpif(production, htmlmin({
						removeComments: true,
						collapseWhitespace: true
					})))
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

	// Browserify Tasks
	vendors: function() {
		var bundler = browserify({
			debug: false,
			fullPaths: !production
		});

		// Loop over the libs and expose them
		libs.forEach(function(lib) {
			bundler.require(lib, { expose: lib });
		});

		var start = new Date();
		console.log('LIB bundle started at ' + start);
		return bundler.bundle()
						.on('error', handleError('Browserify'))
						.pipe(source('libs.js'))
						.pipe(streamify(uglify()))
						.pipe(gulp.dest('public/js/'))
						.pipe(notify(function() {
							console.log('LIB bundle built in ' + (Date.now() - start) + 'ms');
						}));
	},

	apps: function(taskName, bundleName, bundleSource) {
		var bundler = browserify({
			entries: bundleSource,
			debug: !production,
			fullPaths: !production,
			cache: {}, packageCache: {} // apparently needed for watchify
		});

		// Require the external libs
		libs.forEach(function(lib) {
			bundler.external(lib);
		});

		// Setup the enify transform
		bundler.transform(envify());

		// Setup watchify if we should
		if (watch) {
			bundler = watchify(bundler, { delay: 10000 }); // Give reactify time
		}

		var rebundle = function() {
			var start = new Date();
			console.log(taskName + ' bundle started at ' + start);
			return bundler.bundle()
							.on('error', handleError('Browserify'))
							.pipe(source(bundleName))
							.pipe(gulpif(production, streamify(uglify())))
							.pipe(gulp.dest('public/js/'))
							.pipe(notify(function() {
								console.log(taskName + ' bundle built in ' + (Date.now()-start) + 'ms');
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
			'./express.js',
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
gulp.task('adminjs', ['reactify'], tasks.apps.bind(tasks, 'ADMIN', 'admin.js', './build/routers/adminPages.js'));
gulp.task('blogjs', ['reactify'], tasks.apps.bind(tasks, 'BLOG', 'blog.js', './build/routers/blogPages.js'));
gulp.task('clean', tasks.clean);
gulp.task('favicon', tasks.favicon);
gulp.task('fonts', tasks.fonts);
gulp.task('images', tasks.images);
gulp.task('lint:js', tasks.lintjs);
gulp.task('reactify', tasks.reactify);
gulp.task('sass', tasks.sass);
gulp.task('templates', tasks.templates);
gulp.task('test', tasks.test);
gulp.task('vendors', tasks.vendors);

// Macro tasks
gulp.task('browserify', ['vendors', 'blogjs', 'adminjs']);
gulp.task('assets', ['fonts', 'images', 'favicon']);

// This is the main task for production - deploys the code with minification
gulp.task('deploy', ['assets', 'sass', 'templates', 'browserify']);

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
