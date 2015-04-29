// Page showing the different blog posts available
var React = require('react');

var BlogsPage = React.createClass({
	contextTypes: {
		router: React.PropTypes.func
	},

	render: function() {
		return (
			<main className="container-fluid">
			</main>
		);
	}
});

module.exports = BlogsPage;
