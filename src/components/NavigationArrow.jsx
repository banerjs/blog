var React = require('react');

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
		url: React.PropTypes.string
	},

	/**
	 * Render the component based on URL
	 */
	render: function() {
		var arrowClass = "glyphicon " + this.props.arrow_class;
		var visClass = (!!this.props.url) ? "" : " invisible";
		return (
			<a href={this.props.url} className={visClass} style={{color: "inherit"}}>
				<span className={arrowClass}></span>
			</a>
		);
	}
});

module.exports = NavigationArrow;
