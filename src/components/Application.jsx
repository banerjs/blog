// Main page of the application
var React = require('react');
var RouteHandler = require('react-router').RouteHandler;

var Header = require('./Header');
var Footer = require('./Footer');

var Application = React.createClass({
	style: {
		root: {
			display: "table-cell",
			position: "relative",
			paddingBottom: 60
		}
	},

	render: function() {
		return (
			<div style={this.style.root}>
				<Header/>
				<RouteHandler />
				<Footer />
			</div>
		);
	}
});

module.exports = Application;
