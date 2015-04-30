// Page Footer
var React = require('react');
var STYLES = require('../constants/styles');

var Footer = React.createClass({
	style: {
		root: {
			position: "absolute",
			bottom: 0,
			width: "100%",
			height: STYLES.footerHeight,
			borderTop: "solid 1px #ddd"
		}
	},

	render: function() {
		return (
			<footer style={this.style.root}>
				<div className="container-fluid text-muted">
					<div className="row text-center">
						<p className="col-sm-2 text-left">Images from <a href="https://unsplash.com/" target="_blank">Unsplash</a></p>
						<h5 className="col-sm-offset-6 col-sm-2">Contact</h5>
						<h5 className="col-sm-2">Github</h5>
					</div>
				</div>
			</footer>
		);
	}
});

module.exports = Footer;
