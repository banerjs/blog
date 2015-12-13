// This data source gets the data from PG. TODO
var Promise = require('promise');

// Debug
var debug = require('debug')('blog:server');

// Temporary usage of an HTML file for debugging appearance using the About page
var fs = require('fs');
var template;
fs.readFile(__dirname + '/../templates/about.html', function(err, data) {
	if (err) {
		throw err;
	}
	template = data.toString();
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
		var error = null;
		switch(url) {
			case "/":
				html = '<h1>Siddhartha Banerjee<br/><small>Robotics Ph.D. candidate at Georgia Tech</small></h1><p><a href="/about">About</a></p>';
				break;
			case "/about":
			case "/blog1":
				html = template;
				title = "About";
				break;
			case "/blog":
			case "/blog2":
			case "/travels":
				html= '<h1>Coming Soon</h1>';
				break;
			default:
				error = new Error("Not Found");
				error.status = 404;
		}
		return new Promise(function(resolve, reject) {
			if (!!error) {
				reject(error);
			}
			resolve({ html: html, title: title });
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
			}, {
				name: 'Blog',
				url: '/blog',
				slides: ['/blog', '/blog1', '/blog2']
			}, {
				name: 'Travels',
				url: '/travels',
				slides: ['/travels']
			}];
			resolve(sections);
		});
	}
}

module.exports = PG;
