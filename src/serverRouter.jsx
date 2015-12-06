var fs = require('fs');
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var serialize = require('serialize-javascript');

// Debug
var debug = require('debug')('blog:server');

// Personal JS
var Body = require('./components/Body');
var Navigation = require('./components/Navigation');
var DataSource = require('./sources/pg');
var AppStateStore = require('./stores/AppStateStore');
var BlogActions = require('./actions/BlogActions');

var fluxibleApp = require('./createApp')(DataSource, {});

// Make sure to load up the template HTML file at startup
var template;
fs.readFile(__dirname + '/templates/base.html', function(err, data) {
	if (err) {
		throw err;
	}
	template = data.toString();
});

var router = function(req, res, next) {
	// Create a context for this request and populate stores
	var context = fluxibleApp.createContext();
	var moveAction = context.executeAction(BlogActions.moveToNewPage, { url: req.url });
	var fetchAction = context.executeAction(BlogActions.fetchBlogPost, { url: req.url });
	var updateSections = context.executeAction(BlogActions.updateSections, {});

	// Respond to the user only once the store promises have been fulfilled
	Promise.all([moveAction, fetchAction, updateSections]).then(function() {
		var exposed_state = 'window.App=' + serialize(fluxibleApp.dehydrate(context)) + ';';
		var appStore = context.getStore(AppStateStore);

		response = template.replace("TITLE", appStore.getPageTitle())
						   .replace("CONTENT", ReactDOMServer.renderToString(<Body context={context.getComponentContext()} />))
						   .replace("NAVIGATION", ReactDOMServer.renderToString(<Navigation context={context.getComponentContext()} />))
						   .replace("PAGE_CSS", appStore.getPageCSSTag())
						   .replace("EXPOSED_STATE", exposed_state);
		res.contentType = "text/html; charset=utf8";
		res.status(200).end(response);
	}, function(err) {
		next(err);
	});
}

module.exports = router;
