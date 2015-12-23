var React = require('react');

var constants = require('../utils/constants');
var AdminActions = require('../actions/AdminActions');

// Debug
var debug = require('debug')('blog:server');

/**
 * This is the component that presents the login form to the application. It
 * also handles any necessary authentication before redirecting the user to the
 * appropriate page in the event of a successful login
 */
var Login = React.createClass({
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
	 * Initialize the lock mechanism when the component is about to be rendered.
	 * Ensure that this run on the client ONLY!
	 */
	componentWillMount: function() {
		if (typeof window !== 'undefined') {
			var Auth0Lock = require('auth0-lock');
			this.lock = new Auth0Lock(process.env.AUTH0_ID, process.env.AUTH0_NS);
			var authHash = this.lock.parseHash(window.location.hash);
			this.context.executeAction(AdminActions.login, { hash: authHash });
		}
	},

	/**
	 * Push the login URL onto the history stack and change the document title
	 *
	 * Show the login dialog only if the user is not logged in. Otherwise, the
	 * parent component should've preempted the render and rendered the base
	 * admin page.
	 */
	componentDidMount: function() {
		// Update the URL of the page
		this.context.history.push('/admin/login');

		// Update the title of the page
		document.title = "Login" + constants.DEFAULT_TITLE_SEPARATOR
							+ constants.DEFAULT_ADMIN_TITLE;

		// Display the Auth0 lock UI
		this.lock.show({
			container: 'login-box',
			responseType: 'token',
			callbackURL: window.location.origin + '/admin/login'
		});
	},

	/**
	 * Render the component
	 */
	render: function() {
		var style = {
			position: "absolute",
			top: "50%",
			left: "50%",
			msTransform: "translateX(-50%) translateY(-50%)",
			WebkitTransform: "translateX(-50%) translateY(-50%)",
			transform: "translate(-50%, -50%)"
		};
		return (<div id="login-box" style={style}></div>);
	}
});

module.exports = Login;
