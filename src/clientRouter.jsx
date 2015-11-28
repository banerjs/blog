// Libraries required on the client side
var $ = require('jquery');
// var fullpage = require('fullpage.js');
var React = require('react');
var ReactDOM = require('react-dom');
var Fluxible = require('fluxible');
var createHistory = require('history/lib/createBrowserHistory');
var createElementWithContext = require('fluxible-addons-react/createElementWithContext');

// Own JS code required on the client side
var Body = require('./components/Body');
var DataSource = require('./sources/xhr');
var BlogActions = require('./actions/BlogActions');

// Initialize libraries as needed
var fluxibleApp = require('./createApp')(DataSource, { component: Body });

// Retrieve the server state
const dehydratedState = window.App;
fluxibleApp.rehydrate(dehydratedState, function(err, context) {
	if (err) { throw err; }
	window.context = context;

	//TODO Need to initialize better. But this is the gist of it
	ReactDOM.render(createElementWithContext(context, {}), document.getElementById('container'));

    // Initialize the history API and execute update actions on the store when
    // when the URL changes
    history = createHistory();
    history.listen(function(location) {
        context.executeAction(BlogActions.moveToNewPage, { url: location, direction: null });
        context.executeAction(BlogActions.updateSections, {});
    });
});
