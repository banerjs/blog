var React = require('react');

var AppStateStore = require('../stores/AppStateStore');
var BlogActions = require('../actions/BlogActions');

// Debug
var debug = require('debug')('blog:server');

/**
 * This is the class for any of the navigation arrows in the Navigation element
 */
var NavigationArrow = React.createClass({
	/**
	 * Required React field for passing context to the components. This context
	 * is hydrated by Fluxible.
	 */
	contextTypes: {
		getStore: React.PropTypes.func.isRequired,
		executeAction: React.PropTypes.func.isRequired,
		history: React.PropTypes.object
	},

	/**
	 * Type checking for the properties being passed into the component
	 */
	propTypes: {
		arrow_class: React.PropTypes.string.isRequired,
		style_class: React.PropTypes.string,
		url: React.PropTypes.string
	},

	/**
	 * Click handler on the arrow
	 */
	_navigateToURL: function() {
		this.context.history.push(this.props.url);
	},

	/**
	 * Render the component based on URL
	 */
	render: function() {
		var spanClass = "glyphicon " + this.props.arrow_class + " " + this.props.style_class;
		spanClass += (!!this.props.url) ? "" : " invisible";
		return (
			<span className={spanClass} onClick={this._navigateToURL} style={{cursor: 'pointer'}}>
			</span>
		);
	}
});

module.exports = NavigationArrow;
