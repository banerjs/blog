var express = require('express');
var router = express.Router();
var React = require('react');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.end('<html><head><title>Test Page</title><link href="/public/favicon.ico" rel="icon" /></head><body>' + React.createClass({"displayName": "TestDiv", "render": function() { return (React.createElement('p', {"className": "test"}, "Hello World")); }}).renderToString() + '</body></html>');
});

module.exports = router;
