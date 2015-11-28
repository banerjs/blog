var React = require('react');
var BlogActions = require('../actions/BlogActions');
var BlogStore = require('../stores/BlogStore');

/**
 * This is the component that encapsulates the page being viewed by the viewer
 * at this time. It shows a spinning GIF by default until the data regarding its
 * URL has been loaded.
 */
var Page = React.createClass({
	// TODO: Create docstrings for all of these
	contextTypes: {
		getStore: React.PropTypes.func.isRequired,
		executeAction: React.PropTypes.func.isRequired
	},

	propTypes: {
		url: React.PropTypes.string.isRequired
	},

	getInitialState: function() {
		return {
			html: null
		};
	},

	_onBlogPostFetch: function() {
		store = this.context.getStore(BlogStore.constructor);
		this.setState({ html: store.getPostHTML(this.props.url) });
	},

	componentDidMount: function() {
		this.context.getStore(BlogStore.constructor).addChangeListener(this._onBlogPostFetch);
	},

	componentWillUnmount: function() {
		this.context.getStore(BlogStore.constructor).removeChangeListener(this._onBlogPostFetch);
	},

	render: function() {
		var innerHTML = this.state.html;
		if (!innerHTML) {
			innerHTML = <h1>Loading...</h1>;
			this.context.executeAction(BlogActions.fetchBlogPost, { url: this.props.url });
		}
		return (
			<div>{ innerHTML }</div>
		);
	}
});

module.exports = Page;
