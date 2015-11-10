var React = require('react');

/**
 * This is a React wrapper for a fullpage slide. The children of a slide must be
 * HTML divs. The parameters that Slide accepts are both optional
 *
 * @param idName - id to be assigned to the section in the rendered HTML
 * @param htmlClassName - class name to be assigend to the section in HTML
 */
var Slide = React.createClass({
	render: function() {
		// Ensure that the args to this component are correctly parsed
		className = "slide ".concat(!!this.props.htmlClassName ? this.props.htmlClassName : "");
		idName = !!this.props.idName ? this.props.idName : "";
		return (
			<div className={className} id={idName}>
				{this.props.children}
			</div>
		);
	}
});

module.exports = Slide;
