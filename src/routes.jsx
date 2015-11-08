var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var NotFoundRoute = Router.NotFoundRoute;

var Application = require('./components/Application');
var Homepage = require('./components/Homepage');
var BlogsPage = require('./components/BlogsPage');
var TravelsPage = require('./components/TravelsPage');

module.exports = (
	<Route path="/" component={Application}>

		// Routes for the travelogue
		<Route path="/travels" name="travels">
			<IndexRoute component={TravelsPage} />
		</Route>

		// Routes for the blog
		<Route path="/blogs" name="blogs">
			<IndexRoute component={BlogsPage} />
		</Route>

		// Routes for the rest of banerjs.com
		<IndexRoute name="home" component={Homepage} />
	</Route>
);
