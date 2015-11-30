// Libraries required on the client side
var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Fluxible = require('fluxible');
var createElementWithContext = require('fluxible-addons-react/createElementWithContext');
var createHistory = require('history/lib/createBrowserHistory');

// Own JS code required on the client side
var Body = require('./components/Body');
var DataSource = require('./sources/xhr');
var BlogActions = require('./actions/BlogActions');

// Initialize libraries as needed
var fluxibleApp = require('./createApp')(DataSource, { component: Body });

// Retrieve the server state
var dehydratedState = window.App;
fluxibleApp.rehydrate(dehydratedState, function(err, context) {
	if (err) { throw err; }
	window.context = context;

	// Initialize React correctly
	ReactDOM.render(
        createElementWithContext(context, { history: createHistory() }),
        document.getElementById('content')
    );
});
