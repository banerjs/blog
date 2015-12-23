var $ = require('jquery');
var React = require('react');

var AdminStateStore = require('../stores/AdminStateStore');
var AdminActions = require('../actions/AdminActions');

// Debug
var debug = require('debug')('blog:server');

// Child Components
var Login = require('./Login');
var StructureEditor = require('./StructureEditor');
var SectionEditor = require('./SectionEditor');
var PageEditor = require('./PageEditor');

/**
 * This is the main body of the admin pages. When rendered from the server, this
 * component always presents the login form. Only upon render in the client does
 * the component present the admin interface if the user is logged in.
 *
 * This behaviour will always trigger the error message from React stating that
 * client markup is different from server markup. In this one case, the message
 * can safely be ignored.
 */
var Admin = React.createClass({
	/**
	 * Required React field for passing context to the components. This context
	 * is hydrated by ContextWrapper.
	 */
	contextTypes: {
		getStore: React.PropTypes.func.isRequired,
		executeAction: React.PropTypes.func.isRequired,
		history: React.PropTypes.object
	},

	/**
	 * Set the state of the component to have the following form:
	 *	{
	 *		logged_in,
	 *		section,
	 *		slide
	 *	}
	 */
	getInitialState: function() {
		var store = this.context.getStore(AdminStateStore);
		return {
			logged_in: store.getIsLoggedIn()
		};
	},

	/**
	 * Handler for events from the AdminStateStore's change events
	 */
	_onStoreChanged: function() {
		var store = this.context.getStore(AdminStateStore);
		this.setState({
			logged_in: store.getIsLoggedIn(),
			section: store.getCurrentSection(),
			slide: store.getCurrentSlide()
		});
	},

	/**
	 * Register the handler with the AdminStateStore when the component mounts.
	 * Also configure jquery to send XHR requests with the csrf token
	 */
	componentDidMount: function() {
		this.context.getStore(AdminStateStore).addChangeListener(this._onStoreChanged);

		// Configure JQuery XHR calls
		var store = this.context.getStore('AdminStateStore');
		$.ajaxPrefilter(function(options, _, xhr) {
			if (!xhr.crossDomain) {
				xhr.setRequestHeader('X-CSRF-Token', store.getCSRFToken());
			}
		});
	},

	/**
	 * Unregister the handler with the AdminStateStore when the component unmounts
	 */
	componentWillUnmount: function() {
		this.context.getStore(AdminStateStore).removeChangeListener(this._onStoreChanged);
	},

	/**
	 * Render the component
	 */
	render: function() {
		var component;

		// Based on the hierarchy in the edit tree, render the components as
		// needed
		if (!this.state.logged_in) {
			component = <Login />;
		} else if (!this.state.section) {
			component = <StructureEditor />;
		} else if (!this.state.slide) {
			component = <SectionEditor section={this.state.section} />;
		} else {
			component = <PageEditor section={this.state.section} slide={this.state.slide} />;
		}

		// Actually return the component to be redered
		return component;
	}
});

module.exports = Admin;
