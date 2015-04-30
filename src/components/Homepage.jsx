// Homepage
var React = require('react');

// Each section of the homepage renders as a PageSection. The internals of the
// page section are passed in as props. Since the props determine the image being
// shown, the props also have the honour of determining the layout of the internals
// of the section
var PageSection = React.createClass({
	style: {
		root: {
			minHeight: "100%",
			height: "100%",
			width: "100%",
			overflowY: "auto",
			display: "table",
			backgroundImage: null,
			backgroundPosition: "center center",
			backgroundRepeat: "no-repeat",
			backgroundAttachment: "fixed",
			backgroundSize: "cover"
		}
	},

	getBackgroundImageUrl: function() {
		if (!!this.props.image) {
			return "url('/public/images/" + this.props.image + "')";
		}
		return null;
	},

	render: function() {
		this.style.root.backgroundImage = this.getBackgroundImageUrl();
		return (
			<section style={this.style.root}>
			</section>
		);
	}
});

// This is the actual homepage
var Homepage = React.createClass({
	contextTypes: {
		router: React.PropTypes.func
	},

	style: {
		root: {
			height: "100%",
			margin: 0,
			padding: 0
		}
	},

	componentWillUnmount: function() {
	},

	render: function() {
		return (
			<main style={this.style.root}>
				<PageSection image="code.jpg" />
				<PageSection image="books.jpg" />
				<PageSection image="sports.jpg" />
				<PageSection image="nature.jpg" />
				<PageSection image="travel.jpg" />
				<PageSection image="gaze.jpg" />
			</main>
		);
	}
});

module.exports = Homepage;
