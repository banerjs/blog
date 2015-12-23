var Fluxible = require('fluxible');
var PageStore = require('../stores/PageStore');
var SectionsStore = require('../stores/SectionsStore');
var BlogStateStore = require('../stores/BlogStateStore');
var AdminStateStore = require('../stores/AdminStateStore');

var createApp = function(dataSource, mailSource, fluxibleOptions) {
	var app = new Fluxible(fluxibleOptions);
	app.registerStore(PageStore);
	app.registerStore(SectionsStore);
	app.registerStore(BlogStateStore);
	app.registerStore(AdminStateStore);

	// Plug the data source in appropriately
	app.plug({
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
	            	actionContext.getDataSource = function() { return dataSource; };
	            }
			};
	    }

	    // There are no dehydrate/rehydrate methods because the datasource is
	    // different between the server and the client
	});

	// Plug the mail source in appropriately
	app.plug({
		name: 'MailSource Plugin',

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
	            	actionContext.getMailSource = function() { return mailSource; };
	            }
			};
	    }

	    // There are no dehydrate/rehydrate methods because the mailsource is
	    // different between the server and the client

	});

	return app;
};

module.exports = createApp;
