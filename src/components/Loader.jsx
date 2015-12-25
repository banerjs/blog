var $ = require('jquery');
var React = require('react');

// Debug
var debug = require('debug')('blog:server');

/**
 * This is a simple component that displays a loading GIF while the desired page
 * loads. By default, this displays in the center of the page, but the behaviour
 * can be overridden
 */
var Loader = React.createClass({
	propTypes: {
		cssStyle: React.PropTypes.object
	},

	render: function() {
		var style = this.props.cssStyle || {
			position: "absolute",
			top: "50%",
			left: "50%",
			msTransform: "translateX(-50%) translateY(-50%)",
			WebkitTransform: "translateX(-50%) translateY(-50%)",
			transform: "translate(-50%, -50%)"
		};
		return (
			<div className="text-center" style={style}>
				<img src="/public/images/loading_spinner.gif" className="row img-rounded" />
				<h1 className="row">Loading...</h1>
			</div>
		);
	}
});

module.exports = Loader;
