var React = require('react');

var AppStateStore = require('../stores/AppStateStore');
var BlogActions = require('../actions/BlogActions');

// Debug
var debug = require('debug')('blog:server');

// Fetch the sub components
var NavigationArrow = require('./NavigationArrow');
var NavigationSection = require('./NavigationSection');

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
		return {
			sections: sections.slice(1).reverse(),
			home_url: sections[0].url // The section at idx 0 is always HOME
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
	 * Initialize mousetrap and use it!
	 */
	_setupKeyboardNav: function() {
		// Don't proceed if this is server side
		if (typeof window === 'undefined') {
			return;
		}

		// Setup the appropriate variables
		var Mousetrap = require('mousetrap');
		var store = this.props.context.getStore(AppStateStore);
		var history = this.props.history;
		var state = this.state;

		// Create the list of actions that can be taken by Mousetrap
		var keyboardActions = {
			moveUp: function(e) {
				store.getUpURL() && history.push(store.getUpURL());
			},

			moveDown: function(e) {
				store.getDownURL() && history.push(store.getDownURL());
			},

			moveLeft: function(e) {
				store.getLeftURL() && history.push(store.getLeftURL());
			},

			moveRight: function(e) {
				store.getRightURL() && history.push(store.getRightURL());
			},

			goToHome: function(e) {
				history.push(state.home_url);
			},

			goToAbout: function(e) {
				history.push('/about');
			},

			goToBlog: function(e) {
				history.push('/blog');
			},

			goToTravels: function(e) {
				history.push('/travels');
			}
		}

		// Initialize and bind Mousetrap
		Mousetrap.reset();

		Mousetrap.bind('up', keyboardActions.moveUp);
		Mousetrap.bind('w', keyboardActions.moveUp);

		Mousetrap.bind('down', keyboardActions.moveDown);
		Mousetrap.bind('s', keyboardActions.moveDown);

		Mousetrap.bind('left', keyboardActions.moveLeft);
		Mousetrap.bind('a', keyboardActions.moveLeft);

		Mousetrap.bind('right', keyboardActions.moveRight);
		Mousetrap.bind('d', keyboardActions.moveRight);

		Mousetrap.bind('g h', keyboardActions.goToHome);
		Mousetrap.bind('g a', keyboardActions.goToAbout);
		Mousetrap.bind('g b', keyboardActions.goToBlog);
		Mousetrap.bind('g t', keyboardActions.goToTravels);
	},

	/**
	 * Register the handler with the AppStateStore when the component mounts
	 */
	componentDidMount: function() {
		this.props.context.getStore(AppStateStore).addChangeListener(this._onStoreChanged);
		this.props.context.executeAction(BlogActions.updateSections, {});
		this._setupKeyboardNav();
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
			<table className="hidden-xs" style={{maxWidth: "100%", width: "100%", verticalAlign: "middle"}}>
			<tbody>
				<tr>
					<td colSpan="3" className="text-center" style={{padding: 8}}>
						<NavigationArrow url={store.getUpURL()} arrow_class="glyphicon-menu-up" />
					</td>
				</tr>
				<tr>
					<td className="text-left" style={{padding: 8}}>
						<NavigationArrow url={store.getLeftURL()} arrow_class="glyphicon-menu-left" />
					</td>
					<td className="text-center" style={{padding: 8}}>
						<NavigationSection home={this.state.home_url} sections={this.state.sections} />
					</td>
					<td className="text-right" style={{padding: 8}}>
						<NavigationArrow url={store.getRightURL()} arrow_class="glyphicon-menu-right" />
					</td>
				</tr>
				<tr>
					<td colSpan="3" className="text-center" style={{padding: 8}}>
						<NavigationArrow url={store.getDownURL()} arrow_class="glyphicon-menu-down" />
					</td>
				</tr>
			</tbody>
			</table>
		);
	}
});

module.exports = Navigation;
