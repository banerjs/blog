var Fluxible = require('fluxible');
var BlogStore = require('./stores/BlogStore');
var AppStateStore = require('./stores/AppStateStore');

var createApp = function(dataSource, options) {
	const app = new Fluxible(options);
	app.registerStore(BlogStore);
	app.registerStore(AppStateStore);

	// Plug the data source in appropriately
	fluxibleApp.plug({
		name: 'DataSource Plugin',

		/**
	     * Called after context creation to dynamically create a context plugin
	     * @method plugContext
	     * @param {Object} options Options passed into createContext
	     * @param {Object} context FluxibleContext instance
	     * @param {Object} app Fluxible instance
	     * @returns A context plugin
	     */
		plugContext: function (options, context, app) {
			return {
	            /**
	             * Method called to allow modification of the action context
	             * @method plugActionContext
	             * @param {Object} actionContext Options passed into createContext
	             * @param {Object} context FluxibleContext instance
	             * @param {Object} app Fluxible instance
	             */
	            plugActionContext: function(actionContext, context, app) {
	            	actionContext.getDatasource = function() { return dataSource; };
	            }
			};
	    }

	    // There are no dehydrate/rehydrate methods because the datasource is
	    // different between the server and the client
	});
};

module.exports = createApp;
