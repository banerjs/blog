var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var routes = require('./routes');
var createBrowserHistory = require('history/lib/createBrowserHistory');
var history = createBrowserHistory();

React.render(<Router history={history}>{routes}</Router>, document.getElementById("content"));
