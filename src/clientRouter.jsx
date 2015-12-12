// Libraries required on the client side
var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Fluxible = require('fluxible');
var createHistory = require('history/lib/createBrowserHistory');

// Own JS code required on the client side
var ContextWrapper = require('./components/ContextWrapper');
var Body = require('./components/Body');
var Navigation = require('./components/Navigation');
var DataSource = require('./sources/xhr');
var BlogActions = require('./actions/BlogActions');

// Initialize libraries as needed
var fluxibleApp = require('./createApp')(DataSource, {});

// Retrieve the server state
var dehydratedState = window.App;
fluxibleApp.rehydrate(dehydratedState, function(err, context) {
	if (err) { throw err; }
	window.context = context;
    var history = createHistory();

	// Initialize React correctly
	ReactDOM.render(
        <ContextWrapper context={context.getComponentContext()} history={history} component={Body} />,
        document.getElementById('content')
    );
    ReactDOM.render(
        <ContextWrapper context={context.getComponentContext()} history={history} component={Navigation} />,
        document.getElementById('navigation')
    );
});
