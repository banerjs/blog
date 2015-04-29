var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;

var Application = require('./components/Application');
var Homepage = require('./components/Homepage')

module.exports = (
	<Route path="/" handler={Application}>

		// Routes for the travelogue
		<Route path="/travel" name="travel">
			<DefaultRoute handler={Homepage} />
		</Route>

		// Routes for the blog
		<Route path="/blog" name="blog">
			<DefaultRoute handler={Homepage} />
		</Route>

		// Routes for the rest of banerjs.com
		<Route name="home" path="/" handler={Homepage} />
	</Route>
);
