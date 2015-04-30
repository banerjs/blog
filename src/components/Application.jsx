// Main page of the application
var React = require('react');
var RouteHandler = require('react-router').RouteHandler;

var Header = require('./Header');

var Application = React.createClass({
	style: {
		root: {
			margin: 0,
			padding: 0,
			height: "100%"
		}
	},

	render: function() {
		return (
			<div style={this.style.root}>
				<Header/>
				<RouteHandler />
			</div>
		);
	}
});

module.exports = Application;
