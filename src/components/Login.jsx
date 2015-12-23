var React = require('react');

if (typeof window !== 'undefined') {
	var Auth0Lock = require('auth0-lock');
}

var AdminStateStore = require('../stores/AdminStateStore');
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
	 * Set the state of the component to have the following form:
	 *	{
	 *
	 *	}
	 */
	getInitialState: function() {
		var store = this.context.getStore(AdminStateStore);
		return {
			logged_in: store.getLoggedIn()
		};
	},

	/**
	 * Handler for events from the AdminStateStore's change events
	 */
	_onStoreChanged: function() {
		var store = this.context.getStore(AdminStateStore);
		this.setState({ logged_in: store.getLoggedIn() });
	},

	/**
	 * Initialize the lock mechanism when the component is about to be rendered.
	 * Ensure that this run on the client ONLY!
	 */
	componentWillMount: function() {
		if (typeof window !== 'undefined') {
			this.lock = new Auth0Lock(process.env.AUTH0_ID, process.env.AUTH0_NS);
			var authHash = this.lock.parseHash(window.location.hash);
			this.context.executeAction(AdminActions.login, { hash: authHash });
		}
	},

	/**
	 * Register the handler with the AdminStateStore when the component mounts.
	 */
	componentDidMount: function() {
		this.context.getStore(AdminStateStore).addChangeListener(this._onStoreChanged);
		this.lock.show({
			container: 'login-box',
			responseType: 'token'
		});
	},

	/**
	 * Unregister the handler with the AdminStateStore when the component unmounts
	 */
	componentWillUnmount: function() {
		this.context.getStore(AdminStateStore).removeChangeListener(this._onStoreChanged);
	},

	/**
	 * Render the component based on the computed page URL and CSS tags. This is
	 * only called when the URL of the page changes
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
