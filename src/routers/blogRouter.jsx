// Libraries required on the server side
var fs = require('fs');
var Router = require('express').Router;
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var Promise = require('promise');
var serialize = require('serialize-javascript');

// Debug
var debug = require('debug')('blog:server');

// Root level components
var ContextWrapper = require('../components/ContextWrapper');
var Blog = require('../components/Blog');
var Navigation = require('../components/Navigation');

// Sources of data
var DataSource = require('../sources/database');
var MailSource = require('../sources/mail');

// Stores and Actions for storing and manipulating the data
var BlogStateStore = require('../stores/BlogStateStore');
var BlogActions = require('../actions/BlogActions');

// Initialize the application as desired
var fluxibleApp = require('../utils/createApp')(DataSource, MailSource, {});

// Make sure to load up the template HTML file at startup
var template;
fs.readFile(__dirname + '/../templates/blog.html', function(err, data) {
	if (err) {
		throw err;
	}
	template = data.toString();
});

// First setup the router to handle API calls
var apiRouter = Router();
apiRouter.get('/sections', function(req, res, next) {
	DataSource.getSections()
				.then(function(data) {
					res.status(200).json(data);
				}, function(err) {
					next(err);
				});
});

apiRouter.get('*', function(req, res, next) {
	DataSource.getPostFromUrl(req.url)
				.then(function(data) {
					res.status(200).json(data);
				}, function(err) {
					next(err);
				});
});

// Then setup the router to handle Page calls
var router = Router();
router.use('/_/', apiRouter);

router.get('*', function(req, res, next) {
	// Create a context for this request and populate stores
	var context = fluxibleApp.createContext();
	var moveAction = context.executeAction(BlogActions.moveToNewPage, { url: req.url });
	var fetchAction = context.executeAction(BlogActions.fetchBlogPost, { url: req.url });
	var updateSections = context.executeAction(BlogActions.updateSections, {});

	// Respond to the user only once the store promises have been fulfilled
	Promise.all([moveAction, fetchAction, updateSections]).then(function() {
		var exposed_state = 'window.App=' + serialize(fluxibleApp.dehydrate(context)) + ';';
		var appStore = context.getStore(BlogStateStore);

		response = template.replace("TITLE", appStore.getPageTitle())
						   .replace("CONTENT", ReactDOMServer.renderToString(
		   						<ContextWrapper context={context.getComponentContext()} component={Blog} />
						   	))
						   .replace("NAVIGATION", ReactDOMServer.renderToString(
						   		<ContextWrapper context={context.getComponentContext()} component={Navigation} />
						   	))
						   .replace("PAGE_CSS", appStore.getPageCSSTag())
						   .replace("EXPOSED_STATE", exposed_state);
		res.contentType = "text/html; charset=utf8";
		res.status(200).end(response);
	}, function(err) {
		next(err);
	});
});

module.exports = router;
