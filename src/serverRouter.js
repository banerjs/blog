var fs = require('fs');
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var serialize = require('serialize-javascript');
var createElementWithContext = require('fluxible-addons-react/createElementWithContext');

// Debug
var debug = require('debug')('blog:server');

// Personal JS
var Body = require('./components/Body');
var DataSource = require('./sources/pg');
var AppStateStore = require('./stores/AppStateStore');
var BlogActions = require('./actions/BlogActions');

var fluxibleApp = require('./createApp')(DataSource, { component: Body });

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
	var moveAction = context.executeAction(BlogActions.moveToNewPage, { url: req.originalUrl });
	var fetchAction = context.executeAction(BlogActions.fetchBlogPost, { url: req.originalUrl });

	// Respond to the user only once the store promises have been fulfilled
	Promise.all([moveAction, fetchAction]).then(function() {
		var exposed_state = 'window.App=' + serialize(fluxibleApp.dehydrate(context)) + ';';
		var appStore = context.getStore(AppStateStore);

		response = template.replace("TITLE", appStore.getPageTitle())
						   .replace("CONTENT", ReactDOMServer.renderToString(createElementWithContext(context, {})))
						   .replace("PAGE_CSS", appStore.getPageCSSTag())
						   .replace("EXPOSED_STATE", exposed_state);
		res.contentType = "text/html; charset=utf8";
		res.status(200).end(response);
	});
}

module.exports = router;
