var React = require('react');

var constants = require('../utils/constants');
var AdminActions = require('../actions/AdminActions');
var PageStore = require('../stores/PageStore');

// Debug
var debug = require('debug')('blog:server');

// Child Components
var Loader = require('./Loader');

/**
 * This component is the component that displays the details of the pages in the
 * given component in the SectionEditor
 */
var InlinePage = React.createClass({
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
	 * The component expects an optional URL to be passed in
	 */
	propTypes: {
		url: React.PropTypes.string.isRequired
	},

	/**
	 * The component stores the details of the page after it has been put in the
	 * store
	 */
	getInitialState: function() {
		var store = this.context.getStore(PageStore);
		return {
			post: store.getPost(this.props.url)
		}
	},

	/**
	 * Callback URL for when a blog post is fetched into the store
	 */
	_onStoreChanged: function() {
		var store = this.context.getStore(PageStore);
		if (!!store.getPost(this.props.url) && !this.state.post) {
			this.setState({ post: store.getPost(this.props.url) });
		}
	},

	/**
	 * Register the handler with the PageStore when the component mounts.
	 */
	componentDidMount: function() {
		this.context.getStore(PageStore).addChangeListener(this._onStoreChanged);
	},

	/**
	 * Clean up after yourself and remove the store change listener on unmount
	 */
	componentWillUnmount: function() {
		this.context.getStore(PageStore).removeChangeListener(this._onStoreChanged);
	},

	/**
	 * Callback to use when the user clicks on a Page link with the intention of
	 * ediiting it
	 */
	_editPage: function() {
		this.context.history.push(constants.ADMIN_PAGES_URL + this.props.url);
	},

	/**
	 * Render the component
	 */
	render: function() {
		var component;

		if (!this.state.post) {		// The details for the page aren't there
			component = (
				<li className="list-group-item">
					<Loader cssStyle={{}} />
				</li>
			);
			this.context.executeAction(AdminActions.fetchBlogPost, { url: this.props.url });
		} else {					// The details for the page have been found
			component = (
				<li className="list-group-item"
					style={{cursor: 'pointer'}}
					onClick={this._editPage}>
					<div className="row">
						<h5 className="col-sm-5 col-xs-12">{this.state.post.title}</h5>
						<h5 className="col-sm-7 col-xs-12"><small>{this.props.url}</small></h5>
					</div>
				</li>
			);
		}

		return component;
	}
});

module.exports = InlinePage;
