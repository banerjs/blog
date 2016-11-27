// Libraries required on the client side
var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Fluxible = require('fluxible');
var createHistory = require('history').createBrowserHistory;

// Root level components
var ContextWrapper = require('../components/ContextWrapper');
var Blog = require('../components/Blog');
var Navigation = require('../components/Navigation');

// Sources of data
var DataSource = require('../sources/xhr');
var MailSource = DataSource; // xhr does the job of sending emails as well

// Actions
var BlogActions = require('../actions/BlogActions');

// Initialize libraries as needed
var fluxibleApp = require('../utils/createApp')(DataSource, MailSource, {});

// Retrieve the server state
var dehydratedState = window.App;
fluxibleApp.rehydrate(dehydratedState, function(err, context) {
	if (err) { throw err; }
	window.context = context;

    // Initialize the routing
    var history = createHistory();
    history.listen(function(location) {
        context.executeAction(BlogActions.moveToNewPage, {
            url: location.pathname
        });
        context.executeAction(BlogActions.updateSections, {});
        return true;
    });

	// Initialize React correctly
	ReactDOM.render(
        <ContextWrapper context={context.getComponentContext()} history={history} component={Blog} />,
        document.getElementById('content')
    );
    ReactDOM.render(
        <ContextWrapper context={context.getComponentContext()} history={history} component={Navigation} />,
        document.getElementById('navigation')
    );
});
