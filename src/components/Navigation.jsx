var React = require('react');

var AppStateStore = require('../stores/AppStateStore');
var BlogActions = require('../actions/BlogActions');

// Debug
var debug = require('debug')('blog:server');

// Fetch the sub components
var NavigationArrow = require('./NavigationArrow');

// Constants
var HOME_PAGE_KEY = 'Home';

/**
 * This is the main Navigation section of the website
 */
var Navigation = React.createClass({
	/**
	 * Required React field for passing context to the components. This context
	 * is hydrated by Fluxible.
	 */
	childContextTypes: {
		getStore: React.PropTypes.func.isRequired,
		executeAction: React.PropTypes.func.isRequired,
		history: React.PropTypes.object
	},

	/**
	 * Required React field for passing context to the child components. This
	 * provides the getStore and executeAction methods from the Fluxible context
	 * to the children.
	 */
	getChildContext: function() {
		return {
			getStore: this.props.context.getStore,
			executeAction: this.props.context.executeAction,
			history: this.props.history
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
	 *		sections: map of section name to URL
	 *		home_url: URL of the homepage
	 *	}
	 */
	getInitialState: function() {
		var store = this.props.context.getStore(AppStateStore);
		return this._generateState(store);
	},

	/**
	 * This method creates the state object for this component from the sections
	 * returned by AppStateStore
	 *
	 * @param store Pointer to AppStateStore
	 * @returns The state object
	 */
	_generateState: function(store) {
		// First regenerate the list of all the sections available
		var sections = store.getSections();
		var map = {};
		sections.forEach(function(section) {
			map[section.name] = section.url;
		});
		return {
			sections: map,
			home_url: map[HOME_PAGE_KEY]
		};
	},

	/**
	 * Handler for events from the AppStateStore's change events
	 */
	_onStoreChanged: function() {
		var store = this.props.context.getStore(AppStateStore);
		this.setState(this._generateState(store));
	},

	/**
	 * Register the handler with the AppStateStore when the component mounts
	 */
	componentDidMount: function() {
		this.props.context.getStore(AppStateStore).addChangeListener(this._onStoreChanged);
		this.props.context.executeAction(BlogActions.updateSections, {});
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
		var store = this.props.context.getStore(AppStateStore);
		return (
			<div className="container-fluid hidden-xs">
				<div className="row text-center">
					<NavigationArrow url={store.getUpURL()} arrow_class="glyphicon-menu-up" style_class="" />
				</div>
				<div className="row">
					<NavigationArrow url={store.getLeftURL()} arrow_class="glyphicon-menu-left" style_class="col-sm-4 text-left" />
					<span className="col-sm-4 text-center glyphicon glyphicon-home"></span>
					<NavigationArrow url={store.getRightURL()} arrow_class="glyphicon-menu-right" style_class="col-sm-4 text-right" />
				</div>
				<div className="row text-center">
					<NavigationArrow url={store.getDownURL()} arrow_class="glyphicon-menu-down" style_class="" />
				</div>
			</div>
		);
	}
});

module.exports = Navigation;
