// Main page of the application
var React = require('react');

var Application = React.createClass({
	contextTypes: {
		router: React.PropTypes.func
	},

	render: function() {
		return (
			<main>
				<h1>Hello World. <small>This is SSR...</small></h1>
				<p>This is some random text</p>
			</main>
		);
	}
});

module.exports = Application;
