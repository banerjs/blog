// Page Header
var React = require('react');
var Link = require('react-router').Link;

var Header = React.createClass({
	render: function() {
		return (
			<header className="page-header">
				<Link to="home" activeClassName="">
					<h1 className="col-xs-12 text-center">Siddhartha Banerjee <small>blog</small></h1>
				</Link>
			</header>
		);
	}
});

module.exports = Header;
