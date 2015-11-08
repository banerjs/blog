// Page Header
var React = require('react');
var Link = require('react-router').Link;

var SubsiteName = React.createClass({
	propTypes: {
		subsite: React.PropTypes.string.isRequired
	},

	getSubsiteName: function() {
		switch(this.props.subsite) {
			case "blogs":
				return " blog";
			case "travels":
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

	style: {
		div: {
			Link: {
				root: {
					color: "inherit",
					textDecoration: "none"
				}
			}
		},
		nav: {
			ul: {
				li: {
					Link: {
						root: {
							color: "inherit",
							textDecoration: "none"
						}
					}
				}
			}
		}
	},

	getSubsite: function() {
		var routes = this.context.router.getCurrentRoutes();
		return routes[1].name;
	},

	render: function() {
		return (
			<header className="page-header">
				<div className="row">
					<Link to="home" style={this.style.div.Link.root}>
						<h1 className="text-center">Siddhartha Banerjee<SubsiteName subsite={this.getSubsite()} /></h1>
					</Link>
				</div>
				<nav>
					<ul className="row list-inline text-center">
						<li className="col-sm-offset-3 col-sm-2"><Link to="home" style={this.style.nav.ul.li.Link.root}><h2><small>Home</small></h2></Link></li>
						<li className="col-sm-2"><Link to="blogs" style={this.style.nav.ul.li.Link.root}><h2><small>Blog</small></h2></Link></li>
						<li className="col-sm-2"><Link to="travels" style={this.style.nav.ul.li.Link.root}><h2><small>Travelogue</small></h2></Link></li>
					</ul>
				</nav>
			</header>
		);
	}
});

module.exports = Header;
