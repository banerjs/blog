// Homepage
var React = require('react');
var STYLES = require('../constants/styles');

var PageSection = React.createClass({
	style: {
		root: {
			height: "100%",
			width: "100%",
			overflowY: "auto",
			display: "table",
			backgroundImage: this.getBackgroundImageUrl(),
			backgroundPosition: "center center",
			backgroundRepeat: "no-repeat",
			backgroundAttachment: "fixed",
			backgroundSize: STYLES.bgImageSize
		}
	},

	getBackgroundImageUrl: function() {
		if (!!this.props.image) {
			return "url('/public/images/" + this.props.image + ");"
		}
		return null;
	},

	render: function() {
		return (
			<section style={this.style.root}>
			</section>
		);
	}
});

var Homepage = React.createClass({
	contextTypes: {
		router: React.PropTypes.func
	},

	componentWillUnmount: function() {
		if (!!globalSkrollr) {
			globalSkrollr.destroy();
		}
	},

	render: function() {
		return (
			<main>
				<script type="text/javascript">{ "var globalSkrollr = skrollr.init({forceHeight: false});" }</script>
			</main>
		);
	}
});

module.exports = Homepage;
