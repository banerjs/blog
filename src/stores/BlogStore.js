// Store for the blog pages
var BaseStore = require('fluxible/addons/BaseStore');
var assign = require('object-assign');
var labels = require('../actions');

// First create the store prototype by extending the BaseStore prototype
var BlogStore = assign({}, BaseStore.prototype, {

	/**
	 * This method handles the completion of the 'FETCH_POST' action
	 *
	 * @param data The data returned from fetching the post. It has 2 fields,
	 *	data.url and data.post
	 */
	handleFetchedPost: function(data) {
		this._posts[data.url] = data.post;
		this.emitChange();
	},

	/**
	 * Return the HTML for a post at a given URL
	 *
	 * @param url
	 */
	getPostHTML: function(url) {
		return this._posts[url] && this._posts[url].html;
	},

	/**
	 * Return the name of a CSS file associated with a given post URL
	 *
	 * @param url
	 */
	getPostCSS: function(url) {
		return this._posts[url] && this._posts[url].css;
	},

	/**
	 * API method to serialize data to the client
	 */
	dehydrate: function() {
		return {
			posts: this._posts
		};
	},

	/**
	 * API method to deserialize data at the client
	 */
	rehydrate: function(state) {
		this._posts = state.posts;
	}
});

// Instantiate a new BlogStore and set its private variables as required by the
// Fluxible dispatcher
BlogStore.storeName = 'BlogStore';
BlogStore.handlers = {
	labels.FETCH_POST: 'handleFetchedPost'
};

// Initialize the BlogStore with no data. The data in this store has the form
// { url: { html, css } }
BlogStore._posts = {}

module.exports = BlogStore;
