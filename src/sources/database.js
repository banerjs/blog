var Promise = require('promise');
var pg = require('pg-promise')({ promiseLib: Promise })(process.env.DATABASE_URL);
var redis = require('redis').createClient(process.env.REDIS_URL, {});

// Debug
var debug = require('debug')('blog:server');

var DATABASE = {
	/**
	 * This retrieves the post associated with a URL.
	 *
	 * @param url The URL of the post to fetch
	 * @return A promise that can be acted upon if this fetch is successful
	 */
	getPostFromUrl: function(url) {
		return pg.oneOrNone("SELECT * FROM posts WHERE url = $1;", url);
	},

	/**
	 * This retrieves the list of sections and pages that are present in the
	 * blog
	 *
	 * @return An array of sections, each of which is an array of URLs
	 */
	getSections: function() {
		return new Promise(function(resolve, reject) {
			try {
				redis.get('sections', function(err, data) {
					if (!data || !!err) {
						reject(err || new Error("Sections don't exist"));
					}
					resolve(JSON.parse(data));
				});
			} catch (e) {
				reject(e);
			}
		});
	}
}

module.exports = DATABASE;
