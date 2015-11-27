// This is the data source that gets the data through XHR calls
var $ = require('jquery');

var API_SERVER_PREFIX = '/_';
var SECTIONS_URL = '/sections'; // TODO: Get this URL value from a routes.js file

var XHR = {
	/**
	 * This retrieves the post associated with a URL.
	 *
	 * @param url The URL of the post to fetch
	 * @return A promise that can be acted upon if this GET is successful
	 */
	getPostFromUrl: function(url) {
		url = API_SERVER_PREFIX + url;
		return $.get(url);
	},

	/**
	 * This retrieves the list of sections and pages that are present in the
	 * blog
	 *
	 * @return An array of sections, each of which is an array of URLs
	 */
	getSections: function() {
		var url = API_SERVER_PREFIX + SECTIONS_URL;
		return $.get(url);
	}
}

module.exports = XHR;
