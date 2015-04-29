var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;

var Application = require('./components/Application');
var Homepage = require('./components/Homepage');
var BlogsPage = require('./components/BlogsPage');
var TravelsPage = require('./components/TravelsPage');

module.exports = (
	<Route path="/" handler={Application}>

		// Routes for the travelogue
		<Route path="/travels" name="travels">
			<DefaultRoute handler={TravelsPage} />
		</Route>

		// Routes for the blog
		<Route path="/blogs" name="blogs">
			<DefaultRoute handler={BlogsPage} />
		</Route>

		// Routes for the rest of banerjs.com
		<DefaultRoute name="home" handler={Homepage} />
	</Route>
);
