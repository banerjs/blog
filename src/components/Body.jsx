var $ = require('jquery');
var React = require('react');
var AppStateStore = require('../stores/AppStateStore');

// Fetch the page component
var Page = require('./Page');

/**
 * This is the main Body of the application. Use this to manage the skeleton of
 * the App. Currently, Body displays a single page only; in the future we might
 * have to preload the sections surrounding the current page in order to get the
 * animations to work properly.
 */
var Body = React.createClass({
	// TODO: Create docstrings for all of these
	contextTypes: {
		getStore: React.PropTypes.func.isRequired,
		executeAction: React.PropTypes.func.isRequired
	},

	getInitialState: function() {
		store = this.context.getStore(AppStateStore);
		return {
			url: store.getCurrentURL(),
			css_tag: store.getPageCSSTag()
		};
	},

	_updateCSS: function() {
		$("#page_style").replaceWith($(this.state.css_tag));
	},

	_onNewPage: function() {
		store = this.context.getStore(AppStateStore);
		this.setState({
			url: store.getCurrentURL(),
			css_tag: store.getPageCSSTag()
		});
	},

	componentDidMount: function() {
		this.context.getStore(AppStateStore).addChangeListener(this._onNewPage);
	},

	componentWillUnmount: function() {
		this.context.getStore(AppStateStore).removeChangeListener(this._onNewPage);
	},

	render: function() {
		this._updateCSS();
		return (
			<div id="fullpage">
				<Page url={this.state.url} />
			</div>
		);
	}
});

module.exports = Body;
