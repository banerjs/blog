var React = require('react');

var constants = require('../utils/constants');
var AdminActions = require('../actions/AdminActions');

// Debug
var debug = require('debug')('blog:server');

/**
 * This is a simple button that initiates the logout process from any of the
 * Admin pages
 */
var LogoutButton = React.createClass({
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
	 * Callback function that gets executed when the user wants to logout
	 */
	_logout: function() {
		this.context.history.push(constants.LOGOUT_URL);
	},

	/**
	 * Render the component
	 */
	render: function() {
		return (
			<button className="btn btn-danger" onClick={this._logout}>
			{"Logout"}
			</button>
		);
	}
});

module.exports = LogoutButton;
