// This file is an interface into all the database sources used on the server:
// 1. Postgres
// 2. Redis
// 3. File System
var fs = require('fs');
var path = require('path');
var Promise = require('promise');
var pg = require('pg-promise')({ promiseLib: Promise })(process.env.DATABASE_URL);
var redis = require('redis').createClient(process.env.REDIS_URL, {});

// Debug
var debug = require('debug')('blog:server');

// Load all the posts into memory.
// TODO: Fix this at some point in the future. Create a proper cache
var postsHTML = {};
var constants = require('../utils/constants');
var postFinder = require('../utils/postFinder');
postFinder(function(err, filenames) {
	if (!!err) {
		console.error(err);
		return;
	}

	filenames.forEach(function(postfile) {
		fs.readFile(path.resolve(constants.POST_ROOT_DIR, postfile), function(err, html) {
			if (err) {
				console.error(err);
				return;
			}
			postsHTML[postfile] = html.toString();
		});
	});
});

var DATABASE = {
	/**
	 * This retrieves the post associated with a URL. If the post is retrieved
	 * successfully, then the associated HTML to the post is added in. Otherwise
	 * in the case of error, the problem no further actions are taken.
	 * Therefore, error handling must be handled by callers of this function
	 *
	 * @param url The URL of the post to fetch
	 * @return A promise that can be acted upon if this fetch is successful
	 */
	getPostFromUrl: function(url) {
		return pg.oneOrNone("SELECT * FROM posts WHERE url = $1;", url)
					.then(function(post) {
						if (!post) {
							return post;
						}

						post.html = postsHTML[post.filename] || null;
						return post;
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
			} catch (e) {
				reject(e);
			}
		});
	}
}

module.exports = DATABASE;
