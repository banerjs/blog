// datastore.js - Stores the data that needs to be displayed on the website

var AppDispatcher; // TODO: This is some dispatcher that I figure out. Based on desired actions
var EventEmitter = require('events').EventEmitter;
var Constants; // TODO: This is an object of constants that might come in handy when defining actions
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

// This is the data contained within the store. Checkout the data model in
// notes.md to learn more about what this data structure looks like.
var _data; // TODO: There needs to be a way to initialize this. Both client-side and server-side

// ------------------------------------
// TODO: Based on the actions, create functions to perform those here
// ------------------------------------

var DataStore = assign({}, EventEmitter.prototype, {

	// TODO: Create "public" functions that allow interested objects to query
	// _data as needed. Again, this depends on the type of actions that exist in
	// this blog.

	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},

	/**
	 * @param {function} callback
	 */
	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},

	/**
	 * @param {function} callback
	 */
	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},

	/**
	 * {number} index of this store's callback in the dispatcher's queue
	 */
	dispatcherIndex: AppDispatcher.register(function(payload) {
		var action = payload.action;
		var text;

		switch(action.actionType) {
			// Add in the case statements as appropriate based on actions defined
		}

		return true; // The Promise in Dispatcher needs no errors
	})
});

module.exports = DataStore;
