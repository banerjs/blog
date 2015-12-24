// File defining all the app-wide constants
var constants = {
	// Home page and Admin home page
	BLOG_HOME_PAGE: '/',
	ADMIN_HOME_PAGE: '/admin/sections',

	// Key that the user token is stored under in window.localStorage
	LOCAL_STORAGE_USER_TOKEN: 'userToken',

	// URL for login
	LOGIN_URL: '/admin/login',

	// URL for logout
	LOGOUT_URL: '/admin/logout',

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
