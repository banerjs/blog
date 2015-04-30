// Homepage
var React = require('react');

// Component for the internals of the Code section
var CodeHandler = React.createClass({
	statics: {
		getImage: function() {
			return "code.jpg";
		}
	},

	style: {
		root: {
			color: "#fff",
			backgroundColor: "rgba(0,0,0,0.7)",
			marginTop: "40%",
			borderRadius: 5
		}
	},

	render: function() {
		return (
			<div className="col-sm-offset-6 col-sm-6 text-center" style={this.style.root}>
				<h4><span className="glyphicon glyphicon-wrench"></span> Engineering</h4>
				<h4><small>Find me on <a href="https://github.com/banerjs" target="_blank">Github</a></small></h4>
			</div>
		);
	}
});

// Component for the internals of the Books section
var BooksHandler = React.createClass({
	statics: {
		getImage: function() {
			return "books.jpg";
		}
	},

	style: {
		root: {
			color: "#fff",
			height: "100%",
			minHeight: "100%",
			backgroundColor: "rgba(0,0,0,0.7)"
		}
	},

	render: function() {
		return (
			<div className="col-md-offset-6 col-md-6" style={this.style.root}>
				<h4>Books</h4>
			</div>
		);
	}
});

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
		},
		div: {
			root: {
				height: "100%"
			}
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
				<div className="container-fluid" style={this.style.div.root}>
					{this.props.handler}
				</div>
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
				<PageSection handler={<CodeHandler />} image={CodeHandler.getImage()} />
				<PageSection handler={<BooksHandler />} image={BooksHandler.getImage()} />
				<PageSection image="nature.jpg" />
				<PageSection image="travel.jpg" />
				<PageSection image="sports.jpg" />
				<PageSection image="gaze.jpg" />
			</main>
		);
	}
});

module.exports = Homepage;
