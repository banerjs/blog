// Main page of the application
var React = require('react');
var RouteHandler = require('react-router').RouteHandler;

var Header = require('./Header');
var Footer = require('./Footer');

var Application = React.createClass({
	style: {
		minHeight: "100%",
		display: "inherit",
		width: "100%",
		position: "relative",
		padding: "0 0 60px"
	},

	render: function() {
		return (
			<div>
				<Header/>
				<RouteHandler />
				<Footer />
			</div>
		);
	}
});

module.exports = Application;
