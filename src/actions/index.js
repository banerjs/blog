// String Constants representing the different actions that can be performed in
// this blog. By default, requiring 'actions' will import this file
var labels = {
	// Fired when the HTML/CSS of a post is fetched
	FETCH_POST: "FETCH_POST",

	// Fired when a user navigates to a new page
	NEW_PAGE: "NEW_PAGE",

	// Fired when the sections in the app are updated.
	FETCH_SECTIONS: "FETCH_SECTIONS",

	// Fired when the user logs in successfully
	LOGGED_IN: "LOGGED_IN",

	// Fired when the user logs out successfully
	LOGGED_OUT: "LOGGED_OUT",

	// Fired when the CSRF token needs to be loaded into the store
	LOAD_CSRF: "LOAD_CSRF"
}

module.exports = labels;
