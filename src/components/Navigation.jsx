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
	 *		sections: map of section name to URL
	 *		home_url: URL of the homepage
	 *	}
	 */
	getInitialState: function() {
		var store = this.context.getStore(AppStateStore);
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
		var store = this.context.getStore(AppStateStore);
		this.setState(this._generateState(store));
	},

	/**
	 * Initialize the listeners that allow for intuitive keyboard and mouse
	 * navigation
	 */
	_setupNavGestures: function() {
		// Don't proceed if this is server side
		if (typeof window === 'undefined') {
			return;
		}

		// Setup the appropriate variables
		var Mousetrap = require('mousetrap');
		var Hammer = require('hammerjs');
		var store = this.context.getStore(AppStateStore);
		var history = this.context.history;
		var state = this.state;

		// Create the list of actions that can be taken by Mousetrap
		var navigationActions = {
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
			}
		}

		// Initialize and bind Mousetrap
		Mousetrap.reset();

		Mousetrap.bind('up', navigationActions.moveUp);
		Mousetrap.bind('w', navigationActions.moveUp);

		Mousetrap.bind('down', navigationActions.moveDown);
		Mousetrap.bind('s', navigationActions.moveDown);

		Mousetrap.bind('left', navigationActions.moveLeft);
		Mousetrap.bind('a', navigationActions.moveLeft);

		Mousetrap.bind('right', navigationActions.moveRight);
		Mousetrap.bind('d', navigationActions.moveRight);

		Mousetrap.bind('g h', navigationActions.goToHome);

		// Initialize and bind Hammer
		var hammertime = new Hammer(document.body);
		hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

		hammertime.on('swipedown', navigationActions.moveUp);
		hammertime.on('swipeup', navigationActions.moveDown);
		hammertime.on('swiperight', navigationActions.moveLeft);
		hammertime.on('swipeleft', navigationActions.moveRight);
	},

	/**
	 * Register the handler with the AppStateStore when the component mounts
	 */
	componentDidMount: function() {
		this.context.getStore(AppStateStore).addChangeListener(this._onStoreChanged);
		this.context.executeAction(BlogActions.updateSections, {});
		this._setupNavGestures();
	},

	/**
	 * Unregister the handler with the AppStateStore when the component unmounts
	 */
	componentWillUnmount: function() {
		this.context.getStore(AppStateStore).removeChangeListener(this._onStoreChanged);
	},

	/**
	 * Render the component based on the computed page URL and CSS tags. This is
	 * only called when the URL of the page changes
	 */
	render: function() {
		var store = this.context.getStore(AppStateStore);
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
