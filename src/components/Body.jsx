var $ = require('jquery');
var React = require('react');

var AppStateStore = require('../stores/AppStateStore');
var BlogActions = require('../actions/BlogActions');

// Debug
var debug = require('debug')('blog:server');

// Fetch the page component
var Page = require('./Page');

/**
 * This is the main Body of the application. Use this to manage the skeleton of
 * the App. Currently, Body displays a single page only; in the future we might
 * have to preload the sections surrounding the current page in order to get the
 * animations to work properly.
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
	 * Type checking for the properties being passed into the component
	 */
	propTypes: {
		history: React.PropTypes.object
	},

	/**
	 * Set the state of the component to have the following form:
	 *	{
	 *		url: window.location.pathname,
	 *		css_tag: <link-to-page-css>,
	 *		title: document.title
	 *	}
	 */
	getInitialState: function() {
		var store = this.context.getStore(AppStateStore);
		return {
			url: store.getCurrentURL(),
			css_tag: store.getPageCSSTag(),
			title: store.getPageTitle()
		};
	},

	/**
	 * Update the CSS tag associated with the page. Do it only on the CLIENT!
	 */
	_updateCSS: function() {
		if (typeof window !== 'undefined') {
			$("#page_style").replaceWith($(this.state.css_tag));
		}
	},

	/**
	 * Update the title of the page. Do it only on the CLIENT!
	 */
	_updateTitle: function() {
		if (typeof window !== 'undefined') {
			document.title = this.state.title;
		}
	},

	/**
	 * Handler for events from the AppStateStore's change events
	 */
	_onStoreChanged: function() {
		var store = this.context.getStore(AppStateStore);
		this.setState({
			url: store.getCurrentURL(),
			css_tag: store.getPageCSSTag(),
			title: store.getPageTitle()
		});
	},

	/**
	 * Register the handler with the AppStateStore when the component mounts
	 */
	componentDidMount: function() {
		this.context.getStore(AppStateStore).addChangeListener(this._onStoreChanged);
	    this.props.history.listenBefore(function(location) {
	    	this.context.executeAction(BlogActions.moveToNewPage, {
	    		url: location.pathname,
	    		direction: null,
	    	});
	    	return true;
	    });
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
		return nextState.url !== this.state.url
				|| nextState.title !== this.state.title;
	},

	/**
	 * Render the component based on the computed page URL and CSS tags. This is
	 * only called when the URL of the page changes
	 */
	render: function() {
		this._updateCSS();
		this._updateTitle();
		return (
			<div>
				<Page url={this.state.url} history={this.props.history} />
			</div>
		);
	}
});

module.exports = Body;
