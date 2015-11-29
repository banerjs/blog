var React = require('react');
var BlogActions = require('../actions/BlogActions');
var BlogStore = require('../stores/BlogStore');

// Debug
var debug = require('debug')('blog:server');

/**
 * This is the component that encapsulates the page being viewed by the viewer
 * at this time. It shows a spinning GIF by default until the data regarding its
 * URL has been loaded.
 */
var Page = React.createClass({
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
		url: React.PropTypes.string.isRequired
	},

	/**
	 * Set the state of the component to have the following form:
	 *	{
	 *		html: Internal HTML of the page
	 *	}
	 */
	getInitialState: function() {
		store = this.context.getStore(BlogStore);
		return {
			html: store.getPostHTML(this.props.url)
		};
	},

	/**
	 * Handler for events from the BlogStore's change events
	 */
	_onStoreChanged: function() {
		store = this.context.getStore(BlogStore);
		this.setState({ html: store.getPostHTML(this.props.url) });
	},

	/**
	 * Register the handler with the BlogStore when the component mounts
	 */
	componentDidMount: function() {
		this.context.getStore(BlogStore).addChangeListener(this._onStoreChanged);
	},

	/**
	 * Unregister the handler with the BlogStore when the component unmounts
	 */
	componentWillUnmount: function() {
		this.context.getStore(BlogStore).removeChangeListener(this._onStoreChanged);
	},

	/**
	 * Ensure that the component updates when there are new props
	 */
	componentWillReceiveProps: function(nextProps) {
		store = this.context.getStore(BlogStore);
		this.setState({ html: store.getPostHTML(nextProps.html) });
	},

	/**
	 * Render the component based on the computed page URL and internal HTML
	 */
	render: function() {
		var innerHTML = this.state.html;
		if (!innerHTML) {
			innerHTML = <h1>Loading...</h1>;
			this.context.executeAction(BlogActions.fetchBlogPost, { url: this.props.url });
		}
		return (
			<div dangerouslySetInnerHTML={{ __html: innerHTML }}></div>
		);
	}
});

module.exports = Page;
