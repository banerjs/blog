// TODO: Consolidate the routes here with the routes for
// the clientRouter and the serverRouter. Might actually want to make 2 routes
// files. One for the pages (which this is also going to borrow from), and
// another for the extra API details that we might want to store

var express = require('express');
var router = express.Router();

var DataSource = require('./sources/database');

// Debug
var debug = require('debug')('blog:server');

/** This file has all the API routes */
router.get('/sections', function(req, res, next) {
	DataSource.getSections()
				.then(function(data) {
					res.status(200).json(data);
				}, function(err) {
					next(err);
				});
});

router.get('*', function(req, res, next) {
	DataSource.getPostFromUrl(req.url)
				.then(function(data) {
					res.status(200).json(data);
				}, function(err) {
					next(err);
				});
});

module.exports = router;
