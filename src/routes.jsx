var React = require('react');
var Router = require('react-router');
var Route = Router.Route;

var Application = require('./components/Application');

module.exports = (
	<Route handler={Application} />
);
