// var React = require('react');
// var ReactRouter = require('react-router');
// var Router = ReactRouter.Router;
// var routes = require('./routes');
// var createBrowserHistory = require('history/lib/createBrowserHistory');

// var history = createBrowserHistory();
// React.render(<Router history={history}>{routes}</Router>, document.getElementById("content"));
var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var fullpage = require('fullpage.js');
var Body = require('./components/Body');

ReactDOM.render(<Body />, document.getElementById('container'));
$('#fullpage').fullpage({
	controlArrows: false,
	// navigation: true,
	// slidesNavigation: true,
	continuousVertical: true,
	loopHorizontal: true,
	recordHistory: false
});
