var React = require('react');
var Router = require('react-router');
var routes = require('./routes');

Router.run(routes, Router.HistoryLocation, function(Handler, state) {
	if (!state.routes.length) {	// If no route could be found, force a server fetch
		location.reload();
	}
	React.render(<Handler />, document.getElementById("content"));
});
