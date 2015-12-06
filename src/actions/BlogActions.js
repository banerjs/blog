// Basic actions that can be generated by the views
var promise = require('promise');
var labels = require('./index');
var BlogStore = require('../stores/BlogStore');

// Debug
var debug = require('debug')('blog:server');

var BlogActions = {
	/**
	 * This is the basic action of retieving the HTML for a given URL
	 *
	 * @param context The actionContext from Fluxible
	 * @param payload An object that contains the URL that data needs to be
	 		fetched for. payload.url must be a valid URL
	 * @return A Promise that reolves to true if everything succeeded.
	 */
	fetchBlogPost: function(context, payload, done) {
		return context.getDataSource()
					.getPostFromUrl(payload.url)
					.then(function(post) {
						data = {
							url: payload.url,
							post: post
						};
						context.dispatch(labels.FETCH_POST, data);
						return true;
					});
	},

	/**
	 * This function handles the transition to a new URL.
	 *
	 * @param context The actionContext from Fluxible
	 * @param payload The details about the move. Contains 1 field: url
	 * @return A Promise that resolves to true if the action succeeded
	 */
	moveToNewPage: function(context, payload, done) {
		var storeUpdate = new Promise(function(resolve, reject) {
			// First create a data structure to send the data back to the stores
			// and also fetch the desired data from the stores
			var store = context.getStore(BlogStore);
			var data = {
				url: payload.url,
				css: store.getPostCSS(payload.url),
				title: store.getPostTitle(payload.url)
			};

			// Then update the stores with the new data
			context.dispatch(labels.NEW_PAGE, data);
			resolve(true);
		});

		return storeUpdate;
	},

	/**
	 * Update the store with the sections and slides that are present in the
	 * Blog
	 *
	 * @param context The actionContext from Fluxible
	 * @param payload This is empty
	 * @return A Promise that resolves to true if the action succeeded
	 */
	updateSections: function(context, payload, done) {
		return context.getDataSource()
					.getSections()
				  	.then(function(sections) {
				  		context.dispatch(labels.UPDATE_SECTIONS, sections);
				  		return true;
				  	});
	}
}

module.exports = BlogActions;
