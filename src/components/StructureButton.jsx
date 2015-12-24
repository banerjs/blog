var React = require('react');

var constants = require('../utils/constants');
var AdminActions = require('../actions/AdminActions');

// Debug
var debug = require('debug')('blog:server');

/**
 * This is a simple button that transitions the user to the structure editing
 * view in the admin portal
 */
var StructureButton = React.createClass({
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
	 * Callback function that gets executed when the user wants to return to the
	 * other sections
	 */
	_editStructure: function() {
		this.context.history.push(constants.ADMIN_HOME_PAGE);
	},

	/**
	 * Render the component
	 */
	render: function() {
		return (
			<button className="btn btn-default" onClick={this._editStructure}>
			{"All Sections"}
			</button>
		);
	}
});

module.exports = StructureButton;
