// Store for the blog pages
var createStore = require('fluxible/addons/createStore');
var labels = require('../actions');

// Debug
var debug = require('debug')('blog:server');

/**
 * Initializes the map of handlers to action labels. Need to do it this way
 * because ES5 does not allow programmatic keys during object specification.
 *
 * @returns Map of action label to store methods
 */
var initHandlers = function() {
	var handlers = {};
	handlers[labels.FETCH_POST] = 'handleFetchedPost';
	return handlers;
};

// First create the store prototype by extending the BaseStore prototype
var PageStore = createStore({
	/**
	 * Recommended Fluxible field for name of the store
	 */
	storeName: 'PageStore',

	/**
	 * Handlers for the different actions
	 */
	handlers: initHandlers(),

	/**
	 * Initialize the store
	 */
	initialize: function(dispatcher) {
		// Of the form { url: { title, html, css } }
		this._posts = {};
	},

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
	 * Return the post at a given URL
	 *
	 * @param url
	 */
	getPost: function(url) {
		return this._posts[url];
	},

	/**
	 * Return the title for a post at a given URL
	 *
	 * @param url
	 */
	getPostTitle: function(url) {
		return this._posts[url] && this._posts[url].title;
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

module.exports = PageStore;
