var React = require('react');

var constants = require('../utils/constants');
var AdminActions = require('../actions/AdminActions');
var AdminStateStore = require('../stores/AdminStateStore');

// Debug
var debug = require('debug')('blog:server');

/**
 * This is the component that presents the login form to the application. It
 * also handles any necessary authentication before redirecting the user to the
 * appropriate page in the event of a successful login
 */
var LoginPage = React.createClass({
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
	 * Change the document title
	 *
	 * Also initialize Auth0-Lock. After initializing, bind to the
	 * AdminStateStore changes, and also make sure that if the user is logged in
	 * then he or she is redirected to the main page.
	 */
	componentDidMount: function() {
		// Update the title of the page
		document.title = "Login" + constants.DEFAULT_TITLE_SEPARATOR
							+ constants.DEFAULT_ADMIN_TITLE;

		// Check the State Store to figure out if the user is logged in
		if (!this._handleUserLoggedIn()) {
			// Initialize Auth0 lock
			var Auth0Lock = require('auth0-lock');
			this.lock = new Auth0Lock(process.env.AUTH0_ID, process.env.AUTH0_NS);
			var authHash = this.lock.parseHash(window.location.hash);
			this.context.executeAction(AdminActions.login, { hash: authHash });

			// Display the Auth0 lock UI
			this.lock.show({
				container: 'login-box',
				responseType: 'token',
				callbackURL: window.location.origin + constants.LOGIN_URL
			});

			// Setup the login handler to listen for the user's logged in
			this.context.getStore(AdminStateStore).addChangeListener(this._handleUserLoggedIn);
		}
	},

	/**
	 * Cleanup after yourself if you were logged in
	 */
	componentWillUnmount: function() {
		this.context.getStore(AdminStateStore).removeChangeListener(this._handleUserLoggedIn);
	},

	/**
	 * This method tests the user's logged in status, and if he/she is logged
	 * in, it directs them to the admin home page
	 *
	 * @return Boolean if the user was redirected
	 */
	_handleUserLoggedIn: function() {
		var handled = false;
		var store = this.context.getStore(AdminStateStore);
		if (store.getIsLoggedIn()) {
			this.context.history.push(constants.ADMIN_HOME_PAGE);
			handled = true;
		}
		return handled;
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

module.exports = LoginPage;
