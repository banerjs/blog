var $ = require('jquery');
var React = require('react');

// Debug
var debug = require('debug')('blog:server');

/**
 * This is a simple component that displays a loading GIF while the desired page
 * loads.
 */
var PageLoader = React.createClass({
	render: function() {
		var style = {
			position: "absolute",
			top: "50%",
			left: "50%",
			width: 200,
			height: 200,
			marginTop: -100,
			marginLeft: -100
		}
		return (
			<div className="text-center" style={style}>
				<img src="/public/images/loading_spinner.gif" className="row img-rounded" />
				<h1 className="row">Loading...</h1>
			</div>
		);
	}
});

module.exports = PageLoader;
