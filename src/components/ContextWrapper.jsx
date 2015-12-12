var React = require('react');

// Debug
var debug = require('debug')('blog:server');

/**
 * This is a class that creates a context for the rest of the app components
 */
var ContextWrapper = React.createClass({
	/**
	 * Required React field for passing context to the components. This context
	 * is hydrated by Fluxible.
	 */
	childContextTypes: {
		getStore: React.PropTypes.func.isRequired,
		executeAction: React.PropTypes.func.isRequired,
		history: React.PropTypes.object
	},

	/**
	 * Required React field for passing context to the child components. This
	 * provides the getStore and executeAction methods from the Fluxible context
	 * to the children.
	 */
	getChildContext: function() {
		return {
			getStore: this.props.context.getStore,
			executeAction: this.props.context.executeAction,
			history: this.props.history
		}
	},

	/**
	 * Type checking for the properties being passed into the component
	 */
	propTypes: {
		history: React.PropTypes.object,
		context: React.PropTypes.object.isRequired,
		component: React.PropTypes.func.isRequired
	},

	/**
	 * Call the render function of the children
	 */
	render: function() {
		return <this.props.component />;
	}
});

module.exports = ContextWrapper;
