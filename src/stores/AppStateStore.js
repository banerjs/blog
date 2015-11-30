// Store for the state of the application
var createStore = require('fluxible/addons/createStore');
var labels = require('../actions');

// Debug
var debug = require('debug')('blog:server');

// Constants
DEFAULT_TITLE = "Siddhartha Banerjee";
DEFAULT_TITLE_SEPARATOR = " | ";

/**
 * Initializes the map of handlers to action labels. Need to do it this way
 * because ES5 does not allow programmatic keys during object specification.
 *
 * @returns Map of action label to store methods
 */
var initHandlers = function() {
	var handlers = {};
	handlers[labels.FETCH_POST] = 'handleFetchedPost';
	handlers[labels.NEW_PAGE] = 'handleNewPage';
	handlers[labels.UPDATE_SECTIONS] = 'handleUpdateSections';
	return handlers;
};

// First create the store prototype by extending the BaseStore prototype
var AppStateStore = createStore({
	/**
	 * Recommended Fluxible field for name of the store
	 */
	storeName: 'AppStateStore',

	/**
	 * Handlers for the different actions
	 */
	handlers: initHandlers(),

	/**
	 * Initialize the store
	 */
	initialize: function(dispatcher) {
		// Of the form { current_url, page_title, page_css, sections[{[]}] }
		this._appState = {};
	},

	/**
	 * This method handles the completion of the 'FETCH_POST' action. The store
	 * only updates the post if that post is the current post being displayed
	 *
	 * @param data The data returned from fetching the post. It has 2 fields,
	 *	data.url and data.post
	 */
	handleFetchedPost: function(data) {
		if (data.url === this._appState.current_url) {
			this._appState.page_css = data.post.css;
			this._appState.page_title = data.post.title;
			this.emitChange();
		}
	},

	/**
	 * This method handles the completion of a 'NEW_PAGE' action
	 *
	 * @param data The data from when the user navigates to a new page. It has
	 *	3 fields, data.url, data.css, and data.title
	 */
	handleNewPage: function(data) {
		// TODO: In the future, add more logic so that we can have transitions
		// between pages in a logically consistent manner (store previous state
		// for example)
		this._appState.current_url = data.url;
		this._appState.page_css = data.css;
		this._appState.page_title = data.title;
		this.emitChange();
	},

	/**
	 * This method handles the completion of an 'UPDATE_SECTIONS' action
	 *
	 * @param data The new sections that are in the app
	 */
	handleUpdateSections: function(data) {
		this._appState.sections = data;
		this.emitChange();
	},

	/**
	 * Return the current URL that the application is on
	 *
	 * @returns url
	 */
	getCurrentURL: function() {
		return this._appState.current_url;
	},

	/**
	 * Return the title of the current page that the application is on
	 *
	 * @returns title
	 */
	getPageTitle: function() {
		// Default title
		if (!this._appState.page_title) {
			return DEFAULT_TITLE;
		}
		return this._appState.page_title + DEFAULT_TITLE_SEPARATOR + DEFAULT_TITLE;
	},

	/**
	 * Return the HTML link tag to fetch the CSS for the current page of the
	 * user. The CSS has the ID of 'page_style' and can thus be selected with
	 * "#page_style"
	 *
	 * @returns HTML to fetch the custom CSS associated with a page
	 */
	getPageCSSTag: function() {
		if (!this._appState.page_css) {
			// Dummy tag needed to keep the '#page_style' ID in context
			return '<link rel="stylesheet" type="text/css" id="page_style" href="/public/css/banerjs.css" />';
		} else {
			return '<link rel="stylesheet" type="text/css" id="page_style" href="/public/css/' + this._appState.page_css + '" />';
		}
	},

	/**
	 * Return the sections that the app is composed of
	 *
	 * @returns Sections as an array of objects
	 */
	getSections: function() {
		return this._appState.sections;
	},

	/**
	 * API method to serialize data to the client
	 */
	dehydrate: function() {
		return {
			appState: this._appState
		};
	},

	/**
	 * API method to deserialize data at the client
	 */
	rehydrate: function(state) {
		this._appState = state.appState;
	}
});

module.exports = AppStateStore;
