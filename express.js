var bodyParser = require('body-parser');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var express = require('express');
var favicon = require('serve-favicon');
var fs = require('fs');
var jwt = require('express-jwt');
var logger = require('morgan');
var path = require('path');

var admin = require('./build/routers/adminRouter');
var blog = require('./build/routers/blogRouter');

// Debug
var debug = require('debug')('blog:server');

// Create the server
var app = express();

// Setup the middleware as required
app.use(compression());
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger((app.get('env') === 'development') ? 'dev' : 'combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Setup the login checkers
var jwtCheck = jwt({
	secret: new Buffer(process.env.AUTH0_SECRET, 'base64'),
	audience: process.env.AUTH0_ID
}).unless({ path: ['/admin/login'] });

// Setup the route handlers
app.use('/admin/', jwtCheck, admin);
app.use('/', blog);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// load error pages into memory
var notFoundPage;
var serverErrorPage;

fs.readFile(__dirname + '/build/templates/404.html', function(err, data) {
  if (err) {
    throw err;
  }
  notFoundPage = data.toString();
});

fs.readFile(__dirname + '/build/templates/500.html', function(err, data) {
  if (err) {
    throw err;
  }
  serverErrorPage = data.toString();
});


// redirect to login if it is a 401
app.use(function(err, req, res, next) {
  if (err.status === 401) {
    res.redirect('/admin/login');
  }
  next(err);
});

// development error handler - will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.end(err.stack.toString());
  });
}

// production error handler - no stacktraces leaked to user
app.use(function(err, req, res, next) {
  var response = "";
  var status = err.status || 500;

  // Send special message/show special page based on the computed status of the
  // error
  if (status === 404) {
    response = (!req.xhr) ? notFoundPage : "data not found";
  } else if (status === 500) {
    response = (!req.xhr) ? serverErrorPage : "server error";
  }

  res.status(status);
  res.end(response);
});

module.exports = app;
