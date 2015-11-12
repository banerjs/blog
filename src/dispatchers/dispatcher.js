// This is copied almost word for word from Facebook's tutorial on the Flux
// pattern.
var Promise = require('promise');
var assign = require('object-assign');

var _callbacks = [];
var _promises = [];

var Dispatcher = function() {};
Dispatcher.prototype = assign({}, Dispatcher.prototype, {

	/**
	 * Register the callbacks of stores so that it may be invoked by an action
	 * @param {function} callback The callback to be registered
	 * @return {number} The index of the callback within the _callbacks array.
	 */
	register: function(callback) {
		_callbacks.push(callback);
		return _callbacks.length - 1; // index
	},

	/**
	 * dispatch a payload
	 * @param {object} payload The data from the action
	 */
	dispatch: function(payload) {
		// Create an array of promises for callbacks to reference
		var resolves = [];
		var rejects = [];
		_promises = _callbacks.map(function(_, i) {
			return new Promise(function(resolve, reject) {
				resolves[i] = resolve;
				rejects[i] = reject;
			});
		});

		// Dispatch to callbacks to resolve/reject as they see fit
		_callbacks.forEach(function(callback, i) {
			Promise.resolve(callback(payload)).then(function() {
				resolves[i](payload);
			}, function() {
				rejects[i](new Error('Dispatcher callback unsuccesful'));
			});
		});

		// Reset _promises for the next dispatch
		_promises = [];
	}
});

module.exports = Dispatcher;
