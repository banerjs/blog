var React = require('react');

var constants = require('../utils/constants');
var AdminActions = require('../actions/AdminActions');
var SectionsStore = require('../stores/SectionsStore');

// Debug
var debug = require('debug')('blog:server');

// Child Components
var Logout = require('./Logout');

/**
 * This is the component that presents the login form to the application. It
 * also handles any necessary authentication before redirecting the user to the
 * appropriate page in the event of a successful login
 */
var StructureEditor = React.createClass({
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
	 * This component uses a private cache of the sections as a means of knowing
	 * whether to update itself. The state also contains a boolean flag for
	 * denoting if the cache of the state has been synchronized with the server.
	 */
	getInitialState: function() {
		var store = this.context.getStore(SectionsStore);
		return {
			sections: store.getSections(),
			synchronized: true,
			error: null
		}
	},

	/**
	 * Handler for the change events fired on the SectionsStore
	 */
	_onStoreChanged: function() {
		var storeSections = this.context.getStore(SectionsStore).getSections();
		var stateSections = this.state.sections;

		// Update the state with information from the server IFF the state
		// matches local state. Otherwise we have to keep trying to refresh the
		// server state to match the client state
		var statesMatch = (storeSections.length === stateSections.length);
		for (var i = 0; i < storeSections.length; i++) {
			if (!statesMatch) { break; }

			if (storeSections[i].name !== stateSections[i].name
					|| storeSections[i].url !== stateSections[i].url) {
				statesMatch = false;
			}
		}

		this.setState({
			sections: (statesMatch) ? storeSections : stateSections,
			synchronized: statesMatch,
			error: (statesMatch) ? null : this.state.error
		});
	},

	/**
	 * Subscribe to any changes in the SectionsStore.
	 *
	 * Also, push this page's URL onto the history stack and update the page's
	 * title
	 */
	componentDidMount: function() {
		this.context.getStore(SectionsStore).addChangeListener(this._onStoreChanged);

		this.context.history.push('/admin/sections');
		document.title = "Sections" + constants.DEFAULT_TITLE_SEPARATOR
							+ constants.DEFAULT_ADMIN_TITLE;
	},

	/**
	 * Clean up after yourself and remove the store change listener on unmount
	 */
	componentWillUnmount: function() {
		this.context.getStore(SectionsStore).removeChangeListener(this._onStoreChanged);
	},

	/**
	 * Render the component
	 */
	render: function() {
		return (
			<div className={"container"}>
				<div className={"page-header text-right"}>
					<Logout />
				</div>
			</div>
		);
	}
});

module.exports = StructureEditor;
