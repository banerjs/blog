// Homepage
var React = require('react');

var Homepage = React.createClass({
	style: {
		height: "100%",
		margin: 0,
		padding: 0
	},

	render: function() {
		return (
			<main style={this.style}>
				<section>
					<p>This is some random text</p>
				</section>
				<section>
					<p>As is this</p>
				</section>
			</main>
		);
	}
});

module.exports = Homepage;
