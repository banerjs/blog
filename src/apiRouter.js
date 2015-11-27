// TODO: Consolidate the routes here with the routes for
// the clientRouter and the serverRouter. Might actually want to make 2 routes
// files. One for the pages (which this is also going to borrow from), and
// another for the extra API details that we might want to store

var express = require('express');
var router = express.Router();

var DataSource = require('./sources/pg');

/** This file has all the API routes */
router.get('/', function(req, res, next) {
	res.json({ html: "<h1>Siddhartha Banerjee<br/><small>Robotics Ph.D. candidate at Georgia Tech</small></h1>"});
});

router.get('/about', function(req, res, next) {
	DataSource.getPostFromUrl(req.url).then(function(data) {
		res.json(data);
	}, function(err) {
		next(error);
	});
});

router.get('/sections', function(req, res, next) {
	res.json([{ slides: ['/', '/about']}]);
});

module.exports = router;
