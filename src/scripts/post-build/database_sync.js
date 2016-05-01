// This script traverses the posts subdirectory and ensures that the databases
// are in sync with the filesystem
var fs = require('fs');
var path = require('path');
var Promise = require('promise');
var pg = require('pg-promise')({ promiseLib: Promise })(process.env.DATABASE_URL);
var redis = require('redis').createClient(process.env.REDIS_URL, {});

var constants = require('../../utils/constants');

// First traverse the filesystem and index all the post files
var fsresult = new Promise(function(resolve, reject) {		// List the sections
	fs.readdir(constants.POSTS_ROOT_DIR, function(err, folders) {
		if (err) {
			reject(err);
		}
		resolve(folders);
	});
}).then(function(folders) {									// List contents of each section
	var promises = [];
	folders.forEach(function(folder) {
		promises.push(new Promise(function(resolve, reject) {
			fs.readdir(path.resolve(constants.POSTS_ROOT_DIR, folder), function(err, files) {
				if (err) {
					reject(err);
				}
				var data = {
					folder: folder,
					files: files.map(function(file) { return path.join(folder,file); })
				};
				resolve(data);
			});
		}));
	});
	return Promise.resolve(Promise.all(promises));
}).then(function(fsdata) {									// Remove sections that don't have files
	return fsdata.filter(function(data) {
		return data.files.length > 0;
	});
});

// Log the results of the filesystem traversal
fsresult.then(function(result) {
	console.log("FS Index:\n", result);
}, function(err) {
	console.error("(ERROR) FS Index: ", err);
});

// Start the database transactions
// First fetch and execute the required create table SQL
var dbresult = new Promise(function(resolve, reject) {
	fs.readFile(path.resolve(__dirname, 'create_table.sql'), function(err, sql) {
		if (err) {
			reject(err);
		}
		resolve(sql.toString());
	});
}).then(function(sql) {
	var createResult = pg.none(sql).then(function() { return true; }, function(err) { throw err; });
	return Promise.resolve(createResult);
});

// Then fetch the information for the sections from the database
dbresult = dbresult.then(function() {
	var sections = pg.any("SELECT * FROM sections;");
	var posts = pg.any("SELECT * FROM posts;");
	return Promise.resolve(Promise.all([sections, posts]));
}).then(function(results) {
	var sections = results[0];
	var posts = results[1];
	var dbdata = []

	sections.forEach(function(section) {
		var data = {
			folder: section.foldername,
			files: posts.filter(function(post) {
							return post.section === section.id;
						}).map(function(post) {
							return post.filename;
						})
		}
		dbdata.push(data);
	});

	return dbdata;
});

// Log the results of the DB traversal
dbresult.then(function(result) {
	console.log("DB Index:\n", result);
}, function(err) {
	console.error("(ERROR) DB Index: ", err);
});

// Create the insert set and the delete set
var inserts = Promise.all([fsresult, dbresult]).then(function(results) {
	var fsdata = results[0];
	var dbdata = results[1];
	var insertSet = [];

	// First create the insert by checking missing files in DB
	fsdata.forEach(function(fssection) {
		// Find the database section matching this folder section
		var dbsection_idx = dbdata.map(function(data) { return data.folder; }).indexOf(fssection.folder);

		// First check for the presence of a section. Then if the section is
		// present, diff the files
		if (dbsection_idx === -1) {					// Section not present in DB
			insertSet.push({
				folder: fssection.folder,
				files: fssection.files,
				insert_section: true
			});
		} else {									// Section present in DB
			var dbsection = dbdata[dbsection_idx];	// Pointer to database section
			var insertData = {						// Stub data object
				folder: fssection.folder,
				files: [],
				insert_section: false
			}
			fssection.files.forEach(function(fsfile) {	// Check all the files
				var dbfile_idx = dbsection.files.indexOf(fsfile);
				if (dbfile_idx === -1) {			// File is missing in DB
					insertData.files.push(fsfile);
				}
			});
			if (insertData.files.length > 0) {		// Insert files only if missing
				insertSet.push(insertData);
			}
		}
	});

	return insertSet;
});

var deletes = Promise.all([fsresult, dbresult]).then(function(results) {
	var fsdata = results[0];
	var dbdata = results[1];
	var deleteSet = [];

	// Look for missing records in the file system
	dbdata.forEach(function(dbsection) {
		// Find the database section matching this folder section
		var fssection_idx = fsdata.map(function(data) { return data.folder; }).indexOf(dbsection.folder);

		// First check for the presence of a section. Then if the section is
		// present, diff the files
		if (fssection_idx === -1) {					// Section not present in FS
			deleteSet.push({
				folder: dbsection.folder,
				files: dbsection.files,
				delete_section: true
			});
		} else {									// Section present in FS
			var fssection = fsdata[fssection_idx];	// Pointer to database section
			var deleteData = {						// Stub data object
				folder: dbsection.folder,
				files: [],
				delete_section: false
			}
			dbsection.files.forEach(function(dbfile) {	// Check all the files
				var fsfile_idx = fssection.files.indexOf(dbfile);
				if (fsfile_idx === -1) {			// File is missing in FS
					deleteData.files.push(dbfile);
				}
			});
			if (deleteData.files.length > 0) {		// Delete records only if missing
				deleteSet.push(deleteData);
			}
		}
	});

	return deleteSet;
});

// Log the end result of the inserts and deletes
inserts.then(function(result) {
	console.log("Inserts:\n", result);
}, function(err) {
	console.error("(ERROR) Inserts: ", err);
});
deletes.then(function(result) {
	console.log("Deletes:\n", result);
}, function(err) {
	console.error("(ERROR) Deletes: ", err);
});

// Run the insert statements (with sensible defaults)
var execInserts = inserts.then(function(inserts) {
	var promises = [];									// Holder for promises

	// Process each of the sections asynchronously
	inserts.forEach(function(section) {
		var dbpromise = Promise.resolve(true);			// Create a stub promise

		// Update the first action on the promise if a new section must be
		// inserted
		if (!!section.insert_section) {
			var name = section.folder.charAt(0).toUpperCase() + section.folder.slice(1);
			var url = '/' + section.folder;
			dbpromise = dbpromise.then(function() {
				return Promise.resolve(
					pg.none("INSERT INTO sections (name, foldername, url, priority) "
							+ " VALUES ($1, $2, $3, (SELECT coalesce(max(priority),0)+1 FROM sections));",
						[name, section.folder, url])
				);
			});
		}

		// Fetch details about the section for the slide inserts
		dbpromise = dbpromise.then(function() {
			return Promise.resolve(
				pg.one("SELECT * FROM sections WHERE foldername = $1;", section.folder)
			);
		}).then(function(dbsection) {					// Insert slides
			var promises = [];
			section.files.forEach(function(slide) {
				var url = dbsection.url + '/' + path.basename(slide, '.html');
				promises.push(pg.none("INSERT INTO posts (url, section, slide, filename) "
									+ "VALUES ($1, $2, (SELECT coalesce(max(slide),0) + 1 FROM posts WHERE section = $2), $3);",
							[url, dbsection.id, slide]));
			});
			return Promise.resolve(Promise.all(promises));
		});

		promises.push(dbpromise.then(function() { return true; }));
	});

	// This is resolved only when all the inserts have been run
	return Promise.resolve(Promise.all(promises));
});

// Logging for the execution of inserts
execInserts.then(function() { console.log("Inserts Executed"); }, console.error);

// Run the delete statements
var execDeletes = deletes.then(function(deletes) {
	var promises = [];									// Holder for promises

	// Process each of the sections asynchronously
	deletes.forEach(function(section) {
		var delPromises = [];							// Holder slide deletes
		section.files.forEach(function(slide) {
			delPromises.push(pg.none("DELETE FROM posts WHERE filename = $1;", slide));
		});

		var dbpromise = Promise.all(delPromises);		// Resolve on slide del

		if (!!section.delete_section) {					// Delete section too
			dbpromise = dbpromise.then(function() {
				return Promise.resolve(
					pg.none("DELETE FROM sections WHERE foldername = $1;", section.folder)
				);
			});
		}

		promises.push(dbpromise.then(function() { return true; }));
	});
	return Promise.resolve(Promise.all(promises));
});

// Logging for the execution of deletes
execDeletes.then(function() { console.log("Deletes Executed"); }, console.error);

// TODO: Update Redis with the latest data
// var updateRedis = Promise.all([execInserts, execDeletes]).then(function() {

// });

// Exit the script once all the promises are done executing
Promise.all([execInserts, execDeletes]).then(function() {
	console.log("SUCCESS");
	process.exit(0);
}, function() {
	console.error("FAILED");
	process.exit(1);
});
