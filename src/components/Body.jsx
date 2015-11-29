var $ = require('jquery');
var React = require('react');
var AppStateStore = require('../stores/AppStateStore');

// Debug
var debug = require('debug')('blog:server');

// Fetch the page component
var Page = require('./Page');

/**
 * This is the main Body of the application. Use this to manage the skeleton of
 * the App. Currently, Body displays a single page only; in the future we might
 * have to preload the sections surrounding the current page in order to get the
 * animations to work properly. TODO: Add  the ability to change the title
 */
var Body = React.createClass({
	/**
	 * Required React field for passing context to the components. This context
	 * is hydrated by Fluxible.
	 */
	contextTypes: {
		getStore: React.PropTypes.func.isRequired,
		executeAction: React.PropTypes.func.isRequired
	},

	/**
	 * Set the state of the component to have the following form:
	 *	{
	 *		url: window.location.pathname,
	 *		css_tag: <link-to-page-css>
	 *	}
	 */
	getInitialState: function() {
		store = this.context.getStore(AppStateStore);
		return {
			url: store.getCurrentURL(),
			css_tag: store.getPageCSSTag()
		};
	},

	/**
	 * Update the CSS tag associated with the page
	 */
	_updateCSS: function() {
		if (typeof window !== 'undefined') {
			$("#page_style").replaceWith($(this.state.css_tag));
		}
	},

	/**
	 * Handler for events from the AppStateStore's change events
	 */
	_onStoreChanged: function() {
		store = this.context.getStore(AppStateStore);
		this.setState({
			url: store.getCurrentURL(),
			css_tag: store.getPageCSSTag()
		});
	},

	/**
	 * Register the handler with the AppStateStore when the component mounts
	 */
	componentDidMount: function() {
		this.context.getStore(AppStateStore).addChangeListener(this._onStoreChanged);
	},

	/**
	 * Unregister the handler with the AppStateStore when the component unmounts
	 */
	componentWillUnmount: function() {
		this.context.getStore(AppStateStore).removeChangeListener(this._onStoreChanged);
	},

	/**
	 * Ensure that updates only take place when the URL of the app changes
	 *
	 * @param nextProps The updated set of props coming to the component
	 * @param nextState The updated state for the component
	 * @returns true iff the URL of the page has changed
	 */
	shouldComponentUpdate: function(nextProps, nextState) {
		return nextState.url !== this.state.url;
	},

	/**
	 * Render the component based on the computed page URL and CSS tags
	 */
	render: function() {
		this._updateCSS();
		return (
			<div>
				<Page url={this.state.url} />
			</div>
		);
	}
});

module.exports = Body;
