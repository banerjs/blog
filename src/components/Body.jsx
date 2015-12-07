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
	 * is hydrated with information from Fluxible.
	 */
	childContextTypes: {
		getStore: React.PropTypes.func.isRequired,
		executeAction: React.PropTypes.func.isRequired
	},

	/**
	 * Required React field for passing context to the child components. This
	 * provides the getStore and executeAction methods from the Fluxible context
	 * to the children.
	 */
	getChildContext: function() {
		return {
			getStore: this.props.context.getStore,
			executeAction: this.props.context.executeAction
		}
	},

	/**
	 * Type checking for the properties being passed into the component
	 */
	propTypes: {
		history: React.PropTypes.object,
		context: React.PropTypes.object.isRequired
	},

	/**
	 * Set the state of the component to have the following form:
	 *	{
	 *		url: window.location.pathname,
	 *		title: document.title
	 *	}
	 */
	getInitialState: function() {
		var store = this.props.context.getStore(AppStateStore);
		return {
			url: store.getCurrentURL(),
			title: store.getPageTitle()
		};
	},

	/**
	 * Update the CSS tag associated with the page. Do it only on the CLIENT!
	 */
	_updateCSS: function() {
		if (typeof window !== 'undefined') {
			var store = this.props.context.getStore(AppStateStore);
			new_link_tag = $(store.getPageCSSTag());
			old_link_tag = $("#page_style");
			if (old_link_tag[0].href !== new_link_tag[0].href) {
				old_link_tag.replaceWith(new_link_tag);
			}
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
		var store = this.props.context.getStore(AppStateStore);
		if (this.state.url !== store.getCurrentURL()
				|| this.state.title !== store.getPageTitle()) {
			this.setState({
				url: store.getCurrentURL(),
				title: store.getPageTitle()
			});
		}
	},

	/**
	 * Register the handler with the AppStateStore when the component mounts.
	 * Since this only happens on the client, we can safely dereference history
	 */
	componentDidMount: function() {
		this.props.context.getStore(AppStateStore).addChangeListener(this._onStoreChanged);

		// create a pointer to the props object before defining a history
		// listener
		var props = this.props;
	    this.props.history.listenBefore(function(location) {
	    	props.context.executeAction(BlogActions.moveToNewPage, {
	    		url: location.pathname
	    	});
		 	props.context.executeAction(BlogActions.updateSections, {});
	    	return true;
	    });
	},

	/**
	 * Unregister the handler with the AppStateStore when the component unmounts
	 */
	componentWillUnmount: function() {
		this.props.context.getStore(AppStateStore).removeChangeListener(this._onStoreChanged);
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
