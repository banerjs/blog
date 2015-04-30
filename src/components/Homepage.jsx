// Homepage
var React = require('react');
var Link = require('react-router').Link;

// Mixin for a HomepageSectionHandler
var HandlerMixin = {
	style: {
		root: {
			margin: 0,
			padding: 0,
			height: "100%",
			width: "100%",
			position: "relative"
		},
		div: {
			root: {
				color: "#fff",
				backgroundColor: "rgba(0,0,0,0.7)",
				borderRadius: 5,
				position: "absolute",
				top: "30%"
			}
		}
	},

	render: function() {
		return (
			<div style={this.style.root}>
				<div className="col-sm-offset-9 col-sm-3 text-center" style={this.style.div.root}>
					<h4>{this.getTitle()}</h4>
					<h4><small>{this.getBody()}</small></h4>
				</div>
			</div>
		);
	}
};

// Component for the internals of the Code section
var CodeHandler = React.createClass({
	mixins: [HandlerMixin],

	statics: {
		image: "code.jpg"
	},

	getTitle: function() {
		return (
			<span><span className="glyphicon glyphicon-wrench"></span> Engineering</span>
		);
	},

	getBody: function() {
		return (
			<span>My projects are on <a href="https://github.com/banerjs" target="_blank">Github</a></span>
		);
	}
});

// Component for the internals of the Books section
var BooksHandler = React.createClass({
	mixins: [HandlerMixin],

	statics: {
		image: "books.jpg"
	},

	getTitle: function() {
		return (
			<span><span className="glyphicon glyphicon-book"></span> Currently Reading</span>
		);
	},

	getBody: function() {
		return (
			<span>Find me on <a href="https://www.goodreads.com/user/show/41408373-siddhartha-banerjee" target="_blank">Goodreads</a></span>
		);
	}
});

// Component for the internals of the Nature Section
var NatureHandler = React.createClass({
	mixins: [HandlerMixin],

	statics: {
		image: "nature.jpg"
	},

	getTitle: function() {
		return (
			<span><span className="glyphicon glyphicon-tree-conifer"></span> Adventures in Nature</span>
		);
	},

	getBody: function() {
		return (
			<span>Read about them in my <Link to="blogs">Blog</Link></span>
		);
	}
});

// Component for the internals of the Travels section
var TravelsHandler = React.createClass({
	mixins: [HandlerMixin],

	statics: {
		image: "travel.jpg"
	},

	getTitle: function() {
		return (
			<span><span className="glyphicon glyphicon-road"></span> Travels</span>
		);
	},

	getBody: function() {
		return (
			<span>Check them out in my <Link to="travels">Travelogue</Link></span>
		);
	}
});

// Component for the internals of the Health section
var HealthHandler = React.createClass({
	mixins: [HandlerMixin],

	statics: {
		image: "sports.jpg"
	},

	getTitle: function() {
		return (
			<span><span className="glyphicon glyphicon-heart"></span> Health & Fitness</span>
		);
	},

	getBody: function() {
		return (
			<span>My routines are uploaded to my <Link to="blogs">Blog</Link></span>
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
				{this.props.handler}
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
				<PageSection handler={<CodeHandler />} image={CodeHandler.image} />
				<PageSection handler={<BooksHandler />} image={BooksHandler.image} />
				<PageSection handler={<NatureHandler />} image={NatureHandler.image} />
				<PageSection handler={<TravelsHandler />} image={TravelsHandler.image} />
				<PageSection handler={<HealthHandler />} image={HealthHandler.image} />
				<PageSection image="gaze.jpg" />
			</main>
		);
	}
});

module.exports = Homepage;
