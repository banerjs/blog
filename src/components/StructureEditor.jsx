var React = require('react');

var constants = require('../utils/constants');
var AdminActions = require('../actions/AdminActions');
var SectionsStore = require('../stores/SectionsStore');

// Debug
var debug = require('debug')('blog:server');

// Child Components
var LogoutButton = require('./LogoutButton');
var InlineSection = require('./InlineSection');

/**
 * This is the component that the user can use to edit the sections in the site
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
	 * Subscribe to any changes in the SectionsStore. Also, update the page's
	 * title
	 */
	componentDidMount: function() {
		this.context.getStore(SectionsStore).addChangeListener(this._onStoreChanged);

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
	 * Render the component.
	 */
	render: function() {
		// First create a component for each of the sections
		var sections = this.state.sections.map(function(section, idx) {
			return (
				<InlineSection section={section} key={section.name} />
			);
		});

		// Then append the extra add section
		sections.push(<InlineSection key={"section-add"}/>)

		return (
			<div className="container">
				<div className="page-header">
					<div className="row">
					<div className="col-xs-12 text-right">
						<div className="btn-group">
							<LogoutButton />
						</div>
					</div>
					</div>
				</div>
				{sections}
			</div>
		);
	}
});

module.exports = StructureEditor;
