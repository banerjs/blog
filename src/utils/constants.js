// File defining all the app-wide constants
var constants = {
	// Key that the user token is stored under in window.localStorage
	LOCAL_STORAGE_USER_TOKEN: 'userToken',

	// Constants for the page title
	DEFAULT_TITLE: "Siddhartha Banerjee",
	DEFAULT_ADMIN_TITLE: "Admin",
	DEFAULT_TITLE_SEPARATOR: " | ",

	// Default CSS file to use on the Blog
	DEFAULT_BLOG_CSS: "blog.css",

	// Default path to all the CSS files
	DEFAULT_PAGE_CSS_PATH: "/public/css/"
};

module.exports = constants;
