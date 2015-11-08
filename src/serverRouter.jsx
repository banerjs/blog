var fs = require('fs');
var React = require('react');
var ReactRouter = require('react-router');
var match = ReactRouter.match;
var RoutingContext = ReactRouter.RoutingContext;
var routes = require('./routes');

// Make sure to load up the template HTML file at startup
var template;
fs.readFile(__dirname + '/templates/base.html', function(err, data) {
	if (err) {
		throw err;
	}
	template = data.toString();
});

var router = function(req, res, next) {
	match({ routes, location: req.url }, function(error, redirectLocation, renderProps) {
		if (error) {
			next(error)
		} else if (redirectLocation) {
			res.redirect(302, redirectLocation.pathname + redirectLocation.search);
		} else if (renderProps) {
			response = template.replace("TITLE", "Siddhartha Banerjee")
							   .replace("CONTENT", React.renderToString(<RoutingContext {...renderProps} />));
			res.contentType = "text/html; charset=utf8";
			res.status(200).end(response);
		} else {
			res.status(404)
		}
	});
}

module.exports = router;
