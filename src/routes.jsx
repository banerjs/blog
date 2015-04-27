var fs = require('fs');
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;

var Application = React.createClass({
	statics: {
		getTitle: function() {
			return "Test Application";
		}
	},

	contextTypes: {
		router: React.PropTypes.func
	},

	render: function() {
		return (
			<main>
				<h1>Hello World. <small>This is SSR...</small></h1>
				<p>Props: {this.props.req}</p>
				<p>States: {this.state}</p>
			</main>
		);
	}
});

var routes = (
	<Route handler={Application} />
);

// Make sure to load up the template HTML file at startup
var template;
if (fs && fs.readFile) {
	fs.readFile(__dirname + '/templates/base.html', function(err, data) {
		if (err) {
			throw err;
		}
		template = data.toString();
	});
}

var router = function(req, res, next) {
	Router.run(routes, req.url, function(Handler, state) {
		response = template.replace("TITLE", "Test")
						   .replace("CONTENT", React.renderToString(<Handler req={state.req} />));
		res.contentType = "text/html; charset=utf8";
		res.end(response);
	});
}

module.exports = router;
