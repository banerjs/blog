var fs = require('fs');
var React = require('react');
var Router = require('react-router');
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
	Router.run(routes, req.url, function(Handler, state) {
		if (!state.routes.length) {	// If no matching routes were found, raise 404
			var err = new Error('Not Found');
			err.status = 404;
			next(err);
		}
		response = template.replace("TITLE", "Siddhartha Banerjee")
						   .replace("CONTENT", React.renderToString(<Handler />));
		res.contentType = "text/html; charset=utf8";
		res.end(response);
	});
}

module.exports = router;
