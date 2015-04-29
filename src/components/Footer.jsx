// Page Footer
var React = require('react');

var Footer = React.createClass({
	style: {
		root: {
			position: "absolute",
			bottom: 0,
			width: "100%",
			height: 50,		// This value is linked with the padding in Application.jsx
			borderTop: "solid 1px #ddd"
		}
	},

	render: function() {
		return (
			<footer style={this.style.root}>
				<div className="container-fluid text-muted">
					<div className="row">
						<h5 className="col-xs-11 text-right">Contact</h5>
					</div>
				</div>
			</footer>
		);
	}
});

module.exports = Footer;
