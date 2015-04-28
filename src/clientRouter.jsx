var React = require('react');
var Router = require('react-router');
var routes = require('./routes');

Router.run(routes, Router.HistoryLocation, function(Handler, state) {
	console.log(Handler);
	React.render(<Handler />, document.getElementById('content'));
});
