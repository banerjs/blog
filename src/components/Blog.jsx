var $ = require('jquery');
var React = require('react');

var BlogStateStore = require('../stores/BlogStateStore');
var BlogActions = require('../actions/BlogActions');

// Debug
var debug = require('debug')('blog:server');

// Fetch the page component
var Page = require('./Page');

/**
 * This is the main body of the application. Use this to manage the skeleton of
 * the App. Currently, Blog displays a single page only; in the future we might
 * have to preload the sections surrounding the current page in order to get the
 * animations to work properly.
 */
var Blog = React.createClass({
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
	 *		url: window.location.pathname,
	 *		title: document.title
	 *		css: html for #page_style
	 *	}
	 */
	getInitialState: function() {
		var store = this.context.getStore(BlogStateStore);
		return {
			url: store.getCurrentURL(),
			title: store.getPageTitle(),
			css: store.getPageCSSTag()
		};
	},

	/**
	 * Update the CSS tag associated with the page. Do it only on the CLIENT!
	 */
	_updateCSS: function() {
		if (typeof window !== 'undefined') {
			new_link_tag = $(this.state.css);
			old_link_tag = $("#page_style");
			if (old_link_tag.attr('href') !== new_link_tag.attr('href')) {
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
	 * Handler for events from the BlogStateStore's change events
	 */
	_onStoreChanged: function() {
		var store = this.context.getStore(BlogStateStore);
		if (this.state.url !== store.getCurrentURL()
				|| this.state.title !== store.getPageTitle()
				|| this.state.css !== store.getPageCSSTag()) {
			this.setState({
				url: store.getCurrentURL(),
				title: store.getPageTitle(),
				css: store.getPageCSSTag()
			});
		}
	},

	/**
	 * Register the handler with the BlogStateStore when the component mounts.
	 */
	componentDidMount: function() {
		this.context.getStore(BlogStateStore).addChangeListener(this._onStoreChanged);
	},

	/**
	 * Unregister the handler with the BlogStateStore when the component unmounts
	 */
	componentWillUnmount: function() {
		this.context.getStore(BlogStateStore).removeChangeListener(this._onStoreChanged);
	},

	/**
	 * If the URL changed, then fire a GA update page event. This happens only
	 * on the browser
	 */
	componentDidUpdate: function(prevProps, prevState) {
		if (this.state.url !== prevState.url && !!window.ga) {
			window.ga('send', 'pageview', { page: this.state.url });
		}
	},

	/**
	 * Render the component based on the computed page URL and CSS tags. This is
	 * only called when the URL of the page changes
	 */
	render: function() {
		this._updateCSS();
		this._updateTitle();
		return (
			<div id="content_body">
				<Page url={this.state.url} />
			</div>
		);
	}
});

module.exports = Blog;
