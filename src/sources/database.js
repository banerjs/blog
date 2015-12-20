var Promise = require('promise');
var pg = require('pg-promise')({ promiseLib: Promise })(process.env.DATABASE_URL);
var redis = require('redis').createClient(process.env.REDIS_URL, {});

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

var DATABASE = {
	/**
	 * This retrieves the post associated with a URL.
	 *
	 * @param url The URL of the post to fetch
	 * @return A promise that can be acted upon if this fetch is successful
	 */
	getPostFromUrl: function(url) {
		return pg.one("SELECT * FROM posts WHERE url = $1;", url)
					.catch(function(err) {
						if (!!err.message
								&& err.message.toLowerCase().indexOf("no data") > -1) {
							err.status = 404;
						}
						throw err;
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
			try {
				redis.get('sections', function(err, data) {
					if (!data || !!err) {
						reject(err || new Error("Sections don't exist"));
					}
					resolve(JSON.parse(data));
				});
			} catch (err) {
				reject(err);
			}
		});
	}
}

module.exports = DATABASE;
