// TODO: I should update this to use object-assign properly just like the
// example on the Flux page - https://facebook.github.io/flux/docs/todo-list.html

var Dispatcher = {
	_callbacks: [],

	register: function(callback) {
		this._callbacks.push(callback);
		return this._callbacks.length - 1;
	},

	dispatch: function(payload) {
		// First create a bunch of promises
		var promises = this._callbacks.map(function(callback) {
			return new RSVP.Promise(function(resolve, reject) {
				var resolution = callback(payload);
				if (!!resolution) {
					resolve(payload);
				} else {
					reject(new Error('Dispatcher callback ' + callback + ' unsuccessful'));
				}
			});
		});


		// Then try to resolve them. The then clause is empty because a
		// successful resolution is standard practice. The catch is where the
		// interesting code lies
		RSVP.all(promises).catch(function(reason) {
			console.error(reason);
		});
	},

	handleXHRData: function(data) {
		this.dispatch({
			source: 'XHR_DATA',
			action: data
		});
	}
};
