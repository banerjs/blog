var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var Application = require('./components/Application');
var Homepage = require('./components/Homepage')

module.exports = (
	<Route name="home" path="/" handler={Application}>
		<DefaultRoute handler={Homepage} />
	</Route>
);
