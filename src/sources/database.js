// This file is an interface into all the database sources used on the server:
// 1. MongoDB
// 2. File System
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var Promise = require('promise');
var mongo = require('mongodb').connect(process.env.DATABASE_URL, { promiseLibrary: Promise });

// Debug
var debug = require('debug')('blog:server');

// Load all the posts into memory.
var postsHTML = {};
var constants = require('../utils/constants');
var postFinder = require('../utils/postFinder');
postFinder(function(err, filenames) {
	if (!!err) {
		console.error(err);
		return;
	}

	filenames.forEach(function(postfile) {
		fs.readFile(path.resolve(constants.POSTS_ROOT_DIR, postfile), function(err, html) {
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
		return mongo.then(function(db) {
						return db.collection("posts");
					}).then(function(collection) {
						return collection.find({ url: url }).limit(1).next()
					}).then(function(post) {
						if (!post) {
							return post;
						}

						post.html = postsHTML[post.filename] || null;
						return post;
					}).catch(function(reason) {
						console.error(reason);
						throw reason;
					});
	},

	/**
	 * This retrieves the list of sections and pages that are present in the
	 * blog
	 *
	 * @return An array of sections, each of which is an array of URLs
	 */
	getSections: function() {
		return mongo.then(function(db) {
						return db.collection("sections");
					}).then(function(collection) {
						return collection.find({})
										.sort({ 'priority': 1 })
										.toArray();
					});
	}
}

module.exports = DATABASE;
