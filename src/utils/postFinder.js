var fs = require('fs');
var path = require('path');

var POSTS_ROOT_DIR = require('./constants').POSTS_ROOT_DIR;

// Start the helper function `walk` with the correct args
var finder = function (done) {
  walk(POSTS_ROOT_DIR, done);
};

// Helper function to traverse a directory
var walk = function (dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(path.relative(POSTS_ROOT_DIR, file));
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

module.exports = finder;
