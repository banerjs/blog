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
	handlers[labels.FETCH_SECTIONS] = 'handleFetchedSections';
	return handlers;
};

// First create the store prototype by extending the BaseStore prototype
var SectionsStore = createStore({
	/**
	 * Recommended Fluxible field for name of the store
	 */
	storeName: 'SectionsStore',

	/**
	 * Handlers for the different actions
	 */
	handlers: initHandlers(),

	/**
	 * Initialize the store
	 */
	initialize: function(dispatcher) {
		// Of the form [{name, url, slides[]}, ...]
		this._sections = [];
	},

	/**
	 * This method handles the completion of the 'FETCH_SECTIONS' action
	 *
	 * @param data The data returned from fetching the sections. It is stored as
	 *	is
	 */
	handleFetchedSections: function(data) {
		this._sections = data;
		this.emitChange();
	},

	/**
	 * Return the sections that are part of this app along with all the
	 * associated metadata
	 *
	 * @returns The an array of objects, each containing the details of the
	 *	sections
	 */
	getSections: function() {
		return this._sections;
	},

	/**
	 * API method to serialize data to the client
	 */
	dehydrate: function() {
		return {
			sections: this._sections
		};
	},

	/**
	 * API method to deserialize data at the client
	 */
	rehydrate: function(state) {
		this._sections = state.sections;
	}
});

module.exports = SectionsStore;
