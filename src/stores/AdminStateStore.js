// Store for the blog pages
var createStore = require('fluxible/addons/createStore');
var labels = require('../actions');
var constants = require('../utils/constants');;

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
	handlers[labels.LOGGED_IN] = 'handleLoggedIn';
	handlers[labels.LOGGED_OUT] = 'handleLoggedOut';
	handlers[labels.LOAD_CSRF] = 'handleLoadCSRF';
	return handlers;
};

// First create the store prototype by extending the BaseStore prototype
var AdminStateStore = createStore({
	/**
	 * Recommended Fluxible field for name of the store
	 */
	storeName: 'AdminStateStore',

	/**
	 * Handlers for the different actions
	 */
	handlers: initHandlers(),

	/**
	 * Initialize the store
	 */
	initialize: function(dispatcher) {
		// Of the form { section, slide }
		this._adminState = {};
		this._idToken = (typeof window !== 'undefined')
			&& window.localStorage.getItem(constants.LOCAL_STORAGE_USER_TOKEN);
		this._csrf = null;
	},

	/**
	 * Sets the CSRF token for the current session
	 *
	 * @param An object containing the CSRF token for the session
	 */
	handleLoadCSRF: function(data) {
		this._csrf = data.csrf;
		this.emitChange();
	},

	/**
	 * This method handles the completion of the 'LOGGED_IN' action
	 *
	 * @param data The data returned after logging in (auth0). It provides the
	 *	idToken in the returned data, although the token is also available
	 *	through window.localStorage
	 */
	handleLoggedIn: function(data) {
		this._idToken = data.idToken;
		this.emitChange();
	},

	/**
	 * This method handles the completion of the 'LOGGED_OUT' action
	 *
	 * @param data The data used for logging out. It's empty
	 */
	handleLoggedOut: function(data) {
		this._idToken = null;
		this._adminState = {};
		this.emitChange();
	},

	/**
	 * Getter to know if the user has logged in
	 */
	getIsLoggedIn: function() {
		return !!this._idToken;
	},

	/**
	 * Getter for the CSRF Token of this session
	 */
	getCSRFToken: function() {
		return this._csrf;
	},

	/**
	 * Return the current section that's being edited. NULL for the root page
	 */
	getCurrentSection: function() {
		return this._adminState.section;
	},

	/**
	 * Return the current page/slide that is being edited. NULL for the sections
	 * editor page
	 */
	getCurrentSlide: function() {
		return this._adminState.slide;
	},

	/**
	 * API method to serialize data to the client
	 */
	dehydrate: function() {
		return {
			adminState: this._adminState,
			csrf: this._csrf
		};
	},

	/**
	 * API method to deserialize data at the client
	 */
	rehydrate: function(state) {
		this._adminState = state.adminState;
		this._csrf = state.csrf;
	}
});

module.exports = AdminStateStore;
