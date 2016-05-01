// Helper function to convert the sections in the PG database into JSON for the
// Redis database
// Redis JSON format example:
// [
//	{
// 		"name":"Home",
// 		"url":"/",
// 		"priority":1,
// 		"slides": ["/","/about"]
// 	}, ...
// ]
var Promise = require('promise');
var pg = require('pg-promise')({ promiseLib: Promise })(process.env.DATABASE_URL);
var redis = require('redis').createClient(process.env.REDIS_URL, {});

/**
 * This function inspects the state of the posts and sections table of the PG
 * database and then converts that state into a JSON for the Redis database
 *
 * @return A promise that can be inspected to get the JSON sent to Redis
 */
var pg2redis = function() {
	var posts = pg.any("SELECT * FROM posts;");
	var sections = pg.any("SELECT * FROM sections;");

	return Promise.all([posts, sections]).then(function(results) {
		var posts = results[0];
		var sections = results[1];
		var data = [];

		sections.forEach(function(section) {
			var datum = {
				id: section.id,
				name: section.name,
				url: section.url,
				priority: section.priority,
				slides: posts.filter(function(post) {
							return post.section === section.id;
						}).map(function(post) {
							return post.url;
						})
			};
			data.push(datum);
		});

		return data;
	}).then(function(data) {
		redis.set('sections', JSON.stringify(data));
		return data;
	});
};

module.exports = pg2redis;
