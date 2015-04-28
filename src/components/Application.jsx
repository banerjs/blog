// Main page of the application
var React = require('react');
var RouteHandler = require('react-router').RouteHandler;

var Header = require('./Header');

var Application = React.createClass({
	contextTypes: {
		router: React.PropTypes.func
	},

	// For now declaratively define the style within the react class
	style: {
		height: "100%",
		margin: 0,
		padding: 0
	},

	render: function() {
		return (
			<div style={this.style}>
				<Header/>
				<RouteHandler />
			</div>
		);
	}
});

module.exports = Application;
