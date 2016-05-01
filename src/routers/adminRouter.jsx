// Libraries required on the server side
var fs = require('fs');
var path = require('path');
var Router = require('express').Router;
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var Promise = require('promise');
var serialize = require('serialize-javascript');

// Debug
var debug = require('debug')('blog:server');

// Root level components
var ContextWrapper = require('../components/ContextWrapper');
var Admin = require('../components/Admin');

// Sources of data
var DataSource = require('../sources/database');
var MailSource = require('../sources/mail');

// Stores and Actions for storing and manipulating the data
var AdminActions = require('../actions/AdminActions');

// Finally, some utilities
var constants = require('../utils/constants');

// Initialize the application as desired
var fluxibleApp = require('../utils/createApp')(DataSource, MailSource, {});

// Make sure to load up the template HTML file at startup
var template;
fs.readFile(path.resolve(__dirname, '../templates/admin.html'), function(err, data) {
	if (err) {
		throw err;
	}
	template = data.toString();
});

// First setup the router to handle API calls
var apiRouter = Router();

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

router.get('/login', function(req, res, next) {
	// Create a context for this request and populate stores
	var context = fluxibleApp.createContext();
	var loadCSRF = context.executeAction(AdminActions.loadCSRF, { csrf: req.csrfToken() });
	var fetchSections = context.executeAction(AdminActions.fetchSections, {});

	// Respond to the user when all the stores have been hydrated
	Promise.all([loadCSRF, fetchSections]).then(function() {
		var exposed_state = 'window.App=' + serialize(fluxibleApp.dehydrate(context)) + ';';

		response = template.replace("TITLE", "Login" + constants.DEFAULT_TITLE_SEPARATOR + constants.DEFAULT_ADMIN_TITLE)
						   .replace("CONTENT", ReactDOMServer.renderToString(
		   						<ContextWrapper context={context.getComponentContext()} component={Admin} />
						   	))
						   .replace("EXPOSED_STATE", exposed_state);
		res.contentType = "text/html; charset=utf8";
		res.status(200).end(response);
	}, function(err) {
		next(err);
	});
});

module.exports = router;
