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
		return new Promise(function(resolve, reject) {
			html = '<div className="container"><h2>About</h2></div>';
			resolve({ html: html });
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
