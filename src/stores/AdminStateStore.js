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
		// Of the form { url, component, idToken }
		this._adminState = {
			idToken: (typeof window !== 'undefined')
						&& window.localStorage.getItem(constants.LOCAL_STORAGE_USER_TOKEN)
		};
	},

	/**
	 * This method handles the completion of the 'LOGGED_IN' action
	 *
	 * @param data The data returned after logging in (auth0). It provides the
	 *	idToken in the returned data, although the token is also available
	 *	through window.localStorage
	 */
	handleLoggedIn: function(data) {
		this._adminState.idToken = data.idToken;
		this.emitChange();
	},

	/**
	 * This method handles the completion of the 'LOGGED_OUT' action
	 *
	 * @param data The data returned from logging out. It's empty
	 */
	handleLoggedOut: function(data) {
		this._adminState.idToken = null;
		this.emitChange();
	},

	/**
	 * Getter to know if the user has logged in
	 *
	 * @returns Boolean
	 */
	getLoggedIn: function() {
		return !!this._adminState.idToken;
	},

	/**
	 * API method to serialize data to the client
	 */
	dehydrate: function() {
		return {
			state: this._adminState
		};
	},

	/**
	 * API method to deserialize data at the client
	 */
	rehydrate: function(state) {
		this._adminState = state.posts;
	}
});

module.exports = AdminStateStore;
