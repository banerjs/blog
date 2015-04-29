// Page Footer
var React = require('react');

var Footer = React.createClass({
	style: {
		root: {
			position: "absolute",
			bottom: 0,
			width: "100%",
			height: 60,
			borderTop: "#ddd"
		}
	},

	render: function() {
		return (
			<footer style={this.style.root}>
				<div className="container-fluid text-muted">
					<div className="row">
						<span className="col-xs-6" dangerouslySetInnerHTML={{__html: '&copy; Siddhartha Banerjee'}}></span>
						<span className="col-xs-5 text-right">Contact</span>
					</div>
				</div>
			</footer>
		);
	}
});

module.exports = Footer;
