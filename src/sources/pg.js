// This data source gets the data from PG. TODO
var Promise = require('promise');

// Debug
var debug = require('debug')('blog:server');

// Temporary usage of an HTML file for debugging appearance using the About page
var fs = require('fs');
var aboutPage;
fs.readFile(__dirname + '/../templates/about.html', function(err, data) {
	if (err) {
		throw err;
	}
	aboutPage = data.toString();
});

var homePage;
fs.readFile(__dirname + '/../templates/home.html', function(err, data) {
	if (err) {
		throw err;
	}
	homePage = data.toString();
});

var PG = {
	/**
	 * This retrieves the post associated with a URL.
	 *
	 * @param url The URL of the post to fetch
	 * @return A promise that can be acted upon if this GET is successful
	 */
	getPostFromUrl: function(url) {
		var html = null;
		var title = null;
		var css = null;
		var error = null;
		switch(url) {
			case "/":
				html = homePage;
				css = 'home/home.css';
				break;
			case "/about":
				html = aboutPage;
				title = "About";
				break;
			default:
				error = new Error("Not Found");
				error.status = 404;
		}
		return new Promise(function(resolve, reject) {
			if (!!error) {
				reject(error);
			}
			resolve({ html: html, title: title, css: css });
		});
	},

	/**
	 * This retrieves the list of sections and pages that are present in the
	 * blog
	 *
	 * @return An array of sections, each of which is an array of URLs
	 */
	getSections: function() {
		return new Promise(function(resolve, reject) {
			sections = [{
				name: 'Home',
				url: '/',
				slides: ['/', '/about']
			}];
			resolve(sections);
		});
	}
}

module.exports = PG;
