// Libraries required on the client side
var $ = require('jquery');
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
var dehydratedState = window.App;
fluxibleApp.rehydrate(dehydratedState, function(err, context) {
	if (err) { throw err; }
	window.context = context;

	// Initialize React correctly
	ReactDOM.render(createElementWithContext(context, {}), document.getElementById('content'));

    // Initialize the history API and execute update actions on the store when
    // when the URL changes
    var history = createHistory();
    history.listenBefore(function(location) {
        context.executeAction(BlogActions.moveToNewPage, { url: location.pathname, direction: null });
        // context.executeAction(BlogActions.updateSections, {});

        // // Prevent the default action of anchors
        // $("a").click(function(event) {
        //     event.preventDefault();
        //     history.push(event.target.pathname);
        // });
        history.push(location.pathname);
        return false;
    });
});
