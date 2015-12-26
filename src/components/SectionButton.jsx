var React = require('react');

var constants = require('../utils/constants');
var AdminActions = require('../actions/AdminActions');

// Debug
var debug = require('debug')('blog:server');

/**
 * This is a simple button that transitions the user to back to the section
 * editing view for the given page being edited
 */
var SectionButton = React.createClass({
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
	 * This button takes as a prop the section that it needs to send the user
	 * back to
	 */
	propTypes: {
		section: React.PropTypes.object.isRequired
	},

	/**
	 * Callback function that gets executed when the user wants to return to the
	 * other sections
	 */
	_editSection: function() {
		this.context.history.push(constants.ADMIN_SECTIONS_URL + this.props.section.url);
	},

	/**
	 * Render the component
	 */
	render: function() {
		return (
			<button className="btn btn-default" onClick={this._editSection}>
			{"Back"}
			</button>
		);
	}
});

module.exports = SectionButton;
