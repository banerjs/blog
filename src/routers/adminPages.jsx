// Libraries required on the client side
var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Fluxible = require('fluxible');
var createHistory = require('history/lib/createBrowserHistory');

// Root level components
var ContextWrapper = require('../components/ContextWrapper');
var Login = require('../components/Login');

// Sources of data
var DataSource = require('../sources/xhr');
var MailSource = DataSource; // xhr does the job of sending emails as well

// Actions
var AdminActions = require('../actions/AdminActions');

// Initialize libraries as needed
var fluxibleApp = require('../utils/createApp')(DataSource, MailSource, {});

// Retrieve the server state
var dehydratedState = window.App;
fluxibleApp.rehydrate(dehydratedState, function(err, context) {
    if (err) { throw err; }
    window.context = context;

    // Initialize the routing
    var history = createHistory();
    history.listenBefore(function(location) {
        return true;
    });

    // Initialize React correctly
    ReactDOM.render(
        <ContextWrapper context={context.getComponentContext()} history={history} component={Login} />,
        document.getElementById('content')
    );
});
