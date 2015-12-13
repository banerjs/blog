var $ = require('jquery');
var React = require('react');

var BlogActions = require('../actions/BlogActions');
var BlogStore = require('../stores/BlogStore');

// Debug
var debug = require('debug')('blog:server');

// Fetch the sub component
var PageLoader = require('./PageLoader');

/**
 * This is the component that encapsulates the page being viewed by the viewer
 * at this time. It shows a spinning GIF by default until the data regarding its
 * URL has been loaded.
 */
var Page = React.createClass({
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
		var store = this.context.getStore(BlogStore);
		return {
			html: store.getPostHTML(this.props.url)
		};
	},

	/**
	 * Handler for events from the BlogStore's change events
	 */
	_onStoreChanged: function() {
		var store = this.context.getStore(BlogStore);
		this.setState({ html: store.getPostHTML(this.props.url) });
	},

	/**
	 * Disable all anchor tags within the page
	 */
	_disableAnchors: function() {
        // Prevent the default action of anchors
        var history = this.context.history;
        $("a").on('click.anchors', function(event) {
            event.preventDefault();
            history.push($(this).attr('href'));
        });
	},

	/**
	 * Remove all event handlers associated with the anchors so that we don't
	 * fire multiple times for the same event
	 */
	_removeHandlers: function() {
		$("a").off('click.anchors');
	},

	/**
	 * Register the handler with the BlogStore when the component mounts
	 */
	componentDidMount: function() {
		this.context.getStore(BlogStore).addChangeListener(this._onStoreChanged);
		this._disableAnchors(); // Also disable all anchor tags
	},

	/**
	 * Unregister the handler with the BlogStore when the component unmounts
	 */
	componentWillUnmount: function() {
		this.context.getStore(BlogStore).removeChangeListener(this._onStoreChanged);
		this._removeHandlers(); // Also remove all event handlers on the page
	},

	/**
	 * Ensure that the component updates when there are *new* props
	 */
	componentWillReceiveProps: function(nextProps) {
		var store = this.context.getStore(BlogStore);
		this.setState({ html: store.getPostHTML(nextProps.url) });
	},

	/**
	 * Ensure that the component updates when there are *new* props or the state
	 * has changed. Don't update otherwise
	 */
	shouldComponentUpdate: function(nextProps, nextState) {
		var shouldUpdate = this.props.url !== nextProps.url
							|| (!this.state.html && !!nextState.html);

		 // Remove handlers temporarily if you are going to update
		if (shouldUpdate) {
			this._removeHandlers();
		}

		return shouldUpdate;
	},

	/**
	 * Use the update of the component to ensure that all anchor tags are
	 * disabled and to also update the cache of sections
	 */
	 componentDidUpdate: function(prevProps, prevState) {
	 	this._disableAnchors();
	 },

	/**
	 * Render the component based on the computed page URL and internal HTML
	 */
	render: function() {
		// Fetch the HTML for the page if we don't have it
		if (!this.state.html) {
			this.context.executeAction(BlogActions.fetchBlogPost, { url: this.props.url });
			return <PageLoader />
		}

		// Otherwise, display the local HTML that we have on the page
		return (
			<div id="content_page"
				 dangerouslySetInnerHTML={{ __html: this.state.html }}>
			</div>
		);
	}
});

module.exports = Page;
