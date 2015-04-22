var express = require('express');
var router = express.Router();

/** This file has all the API routes */
router.get('/', function (req, res, next) {
	res.json({ "data": "Hello World"});
});

module.exports = router;
