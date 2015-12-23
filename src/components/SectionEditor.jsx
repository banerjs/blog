var React = require('react');

var AdminActions = require('../actions/AdminActions');

// Debug
var debug = require('debug')('blog:server');

/**
 * This is the component that presents the login form to the application. It
 * also handles any necessary authentication before redirecting the user to the
 * appropriate page in the event of a successful login
 */
var SectionEditor = React.createClass({
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
	 * Render the component
	 */
	render: function() {
		return (<div></div>);
	}
});

module.exports = SectionEditor;
