// This data source gets the data from PG. TODO
var Promise = require('promise');

// Debug
var debug = require('debug')('blog:server');

var PG = {
	/**
	 * This retrieves the post associated with a URL.
	 *
	 * @param url The URL of the post to fetch
	 * @return A promise that can be acted upon if this GET is successful
	 */
	getPostFromUrl: function(url) {
		var html;
		var title;
		switch(url) {
			case "/":
			case "/_/":
				html = '<h1>Siddhartha Banerjee<br/><small>Robotics Ph.D. candidate at Georgia Tech</small></h1><p><a href="/about">About</a></p>'
				title = null;
				break;
			case "/about":
			case "/_/about":
				html = '<div className="container"><h2>About</h2><p><a href="/">Home</a></p></div>'
				title = "About";
				break;
			default:
				html = '<h3>Not Found</h3>';
		}
		return new Promise(function(resolve, reject) {
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
			sections = [{ slides: ['/', '/about']}]
			resolve(sections);
		});
	}
}

module.exports = PG;
