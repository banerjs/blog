// Page Header
var React = require('react');
var Link = require('react-router').Link;

var SubsiteName = React.createClass({
	propTypes: {
		subsite: React.PropTypes.string.isRequired
	},

	getSubsiteName: function() {
		switch(this.props.subsite) {
			case "blog":
				return " blog";
			case "travel":
				return " travelogue";
			default:
				return "";
		}
	},

	render: function() {
		return (
			<small>{this.getSubsiteName()}</small>
		);
	}
});

var Header = React.createClass({
	contextTypes: {
		router: React.PropTypes.func
	},

	getSubsite: function() {
		var routes = this.context.router.getCurrentRoutes();
		return routes[1].name;
	},

	// style elements have a "root" element that denotes the root tag. Depending
	// on the need for styling this root element, the presence of this element
	// in the style object is optional
	style: {
		div: {
			Link: {
				color: "inherit",
				textDecoration: "none"
			}
		},
		nav: {
			ul: {
				li: {
					Link: {
						color: "inherit",
						textDecoration: "none"
					}
				}
			}
		}
	},

	render: function() {
		return (
			<header className="page-header">
				<div className="row">
					<Link to="home" style={this.style.div.Link}>
						<h1 className="text-center">Siddhartha Banerjee<SubsiteName subsite={this.getSubsite()} /></h1>
					</Link>
				</div>
				<nav className="row">
					<ul className="col-xs-offset-3 col-xs-6 list-inline text-center">
						<li><Link to="home" style={this.style.nav.ul.li.Link}><h2><small>Home</small></h2></Link></li>
						<li><Link to="travel" style={this.style.nav.ul.li.Link}><h2><small>Travelogue</small></h2></Link></li>
						<li><Link to="blog" style={this.style.nav.ul.li.Link}><h2><small>Blog</small></h2></Link></li>
					</ul>
				</nav>
			</header>
		);
	}
});

module.exports = Header;
