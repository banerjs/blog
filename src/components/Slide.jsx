var React = require('react');

/**
 * This is a React wrapper for a fullpage slide. The children of a slide must be
 * HTML divs. The parameters that Slide accepts are both optional
 *
 * @param idName - id to be assigned to the section in the rendered HTML
 * @param htmlClassName - class name to be assigend to the section in HTML
 * @param stylesheet - object specifying styles for this section
 */
var Slide = React.createClass({
	render: function() {
		// Ensure that the args to this component are correctly parsed
		className = "slide ".concat(!!this.props.htmlClassName ? this.props.htmlClassName : "");
		idName = !!this.props.idName ? this.props.idName : "";
		stylesheet = !!this.props.stylesheet ? this.props.stylesheet : "";

		// Return the computed slide
		return (
			<div className={className} id={idName} style={stylesheet}>
				{this.props.children}
			</div>
		);
	}
});

module.exports = Slide;
