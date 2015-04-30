// Page Footer
var React = require('react');

var Footer = React.createClass({
	style: {
		root: {
			width: "100%",
		}
	},

	render: function() {
		return (
			<footer style={this.style.root}>
				<div className="container-fluid text-muted">
					<div className="row text-center">
						<p className="col-sm-offset-10 col-sm-2">Images from <a href="https://unsplash.com/" target="_blank">Unsplash</a></p>
					</div>
				</div>
			</footer>
		);
	}
});

module.exports = Footer;
