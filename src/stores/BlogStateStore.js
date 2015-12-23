// Store for the state of the application
var createStore = require('fluxible/addons/createStore');
var labels = require('../actions');
var constants = require('../utils/constants');

// Debug
var debug = require('debug')('blog:server');

/**
 * Helper function to generate the link tag associated with the CSS for this
 * page. It uses the predefined HTML id of #page_style to modify the appropriate
 * link tag
 *
 * @param href The href to the CSS file
 * @returns HTML for the link tag
 */
function createCSSLinkTag(href) {
	return '<link rel="stylesheet" type="text/css" id="page_style" href="' + href + '">';
}

/**
 * Helper function to find the indices of the section and slide given an URL
 *
 * @param url The URL that we want to know the section and slide for
 * @param sections The map of sections
 * @returns (section, slide) tuple signifying the indices of the section and
 *	and slide where the url is. (null, null) returned if the URL can't be found
 */
function findSectionSlide(url, sections) {
	var found = false;
	var indices = [null, null];
	for (i = 0; i < sections.length; i++) {
		var slides = sections[i].slides;
		for (j = 0; j < slides.length; j++) {
			if (url === slides[j]) {
				found = true;
				indices = [i, j];
				break;
			}
		}
		if (found) { break; }
	}
	return indices;
}

/**
 * Initializes the map of handlers to action labels. Need to do it this way
 * because ES5 does not allow programmatic keys during object specification.
 *
 * @returns Map of action label to store methods
 */
var initHandlers = function() {
	var handlers = {};
	handlers[labels.FETCH_POST] = 'handleFetchedPost';
	handlers[labels.NEW_PAGE] = 'handleNewPage';
	handlers[labels.FETCH_SECTIONS] = 'handleFetchedSections';
	return handlers;
};

// First create the store prototype by extending the BaseStore prototype
var BlogStateStore = createStore({
	/**
	 * Recommended Fluxible field for name of the store
	 */
	storeName: 'BlogStateStore',

	/**
	 * Handlers for the different actions
	 */
	handlers: initHandlers(),

	/**
	 * Initialize the store. It contains data of the form:
	 *	{ current_url,
	 *	  page_title,
	 *	  page_css,
	 *	  current_idx [section, slide],
	 *	  saved_locations {},
	 *	  sections [{[]}] }
	 */
	initialize: function(dispatcher) {
		this._blogState = {};
	},

	/**
	 * This method handles the completion of the 'FETCH_POST' action. The store
	 * only updates the post if that post is the current post being displayed
	 *
	 * @param data The data returned from fetching the post. It has 2 fields,
	 *	data.url and data.post
	 */
	handleFetchedPost: function(data) {
		if (data.url === this._blogState.current_url) {
			this._blogState.page_css = data.post.css;
			this._blogState.page_title = data.post.title;
			this.emitChange();
		}
	},

	/**
	 * This method handles the completion of a 'NEW_PAGE' action
	 *
	 * @param data The data from when the user navigates to a new page. It has
	 *	3 fields, data.url, data.css, and data.title
	 */
	handleNewPage: function(data) {
		// If the sections have been defined, save the old location of the user
		// and then get the new user locations
		if (!!this._blogState.sections) {
			// Create the saved locations if they don't exist
			if (!this._blogState.saved_locations) {
				this._blogState.saved_locations = {};
				for (i = 0; i < this._blogState.sections.length; i++) {
					this._blogState.saved_locations[this._blogState.sections[i].name] = 0;
				}
			}

			// Update the pointers to the states
			var indices = findSectionSlide(data.url, this._blogState.sections);
			if (indices[0] === null || indices[1] === null) {
				var error = new Error("The sections are unaware of this URL");
				error.status = 404;
				throw error;
			}
			this._blogState.saved_locations[this._blogState.sections[indices[0]].name] = indices[1];
			this._blogState.current_idx = indices;
		}

		this._blogState.current_url = data.url;
		this._blogState.page_css = data.css;
		this._blogState.page_title = data.title;
		this.emitChange();
	},

	/**
	 * This method handles the completion of an 'FETCH_SECTIONS' action
	 *
	 * @param data The new sections that are in the app
	 */
	handleFetchedSections: function(data) {
		this._blogState.sections = data.map(function(section) {
			return {
				name: section.name,
				url: section.url,
				slides: section.slides
			};
		});
		var sections = this._blogState.sections; // Create an alias

		// Create the saved location and current indices if they don't exist
		if (!this._blogState.current_idx) {
			this._blogState.current_idx = findSectionSlide(this._blogState.current_url, sections);
		}

		if (!this._blogState.saved_locations) {
			this._blogState.saved_locations = {};
			for (i = 0; i < sections.length; i++) {
				this._blogState.saved_locations[sections[i].name] = 0;
			}

			// Update the saved location to something we know only if  this is a
			// known URL
			if (this._blogState.current_idx[0] !== null && this._blogState.current_idx[1] !== null) {
				this._blogState.saved_locations[sections[this._blogState.current_idx[0]].name] = this._blogState.current_idx[1];
			}
		}

		// Update the saved_location pointers if the sections have been changed
		for (i = 0; i < sections.length; i++) {
			// Add a default of 0 if a section has been added
			if (!this._blogState.saved_locations[sections[i].name]) {
				this._blogState.saved_locations[sections[i].name] = 0;
			}

			// Reset to default if the state is at a section that no longer
			// exists
			if (this._blogState.saved_locations[sections[i].name] >= sections[i].slides.length) {
				this._blogState.saved_locations[sections[i].name] = 0;
			}

			// We don't care if a section has been deleted
		}

		this.emitChange();
	},

	/**
	 * Return the current URL that the application is on
	 *
	 * @returns url
	 */
	getCurrentURL: function() {
		return this._blogState.current_url;
	},

	/**
	 * Return the title of the current page that the application is on
	 *
	 * @returns title
	 */
	getPageTitle: function() {
		// Default title
		if (!this._blogState.page_title) {
			return constants.DEFAULT_TITLE;
		}
		return this._blogState.page_title + constants.DEFAULT_TITLE_SEPARATOR
				+ constants.DEFAULT_TITLE;
	},

	/**
	 * Return the HTML needed on the CSS for this page
	 *
	 * @returns HTML for the custom CSS associated with a page
	 */
	getPageCSSTag: function() {
		if (!this._blogState.page_css) {
			return createCSSLinkTag(constants.DEFAULT_PAGE_CSS_PATH + constants.DEFAULT_BLOG_CSS);
		}
		return createCSSLinkTag(constants.DEFAULT_PAGE_CSS_PATH + this._blogState.page_css);
	},

	/**
	 * Return the sections that the app is composed of
	 *
	 * @returns Sections as an array of objects
	 */
	getSections: function() {
		return this._blogState.sections;
	},

	/**
	 * Return the URL to the left of the current URL
	 *
	 * @returns URL of the slide to the left if present. Else null
	 */
	getLeftURL: function() {
		if (!this._blogState.sections
				|| !this._blogState.saved_locations
				|| !this._blogState.current_idx
				|| this._blogState.current_idx[0] === 0) {
			return null;
		}
		var sectionIdx = this._blogState.current_idx[0] - 1;
		var slideIdx = this._blogState.saved_locations[this._blogState.sections[sectionIdx].name];
		return this._blogState.sections[sectionIdx].slides[slideIdx];
	},

	/**
	 * Return the URL to the right of the current URL
	 *
	 * @returns URL of the slide to the right if present. Else null
	 */
	getRightURL: function() {
		if (!this._blogState.sections
				|| !this._blogState.saved_locations
				|| !this._blogState.current_idx
				|| this._blogState.current_idx[0] >= this._blogState.sections.length-1) {
			return null;
		}
		var sectionIdx = this._blogState.current_idx[0] + 1;
		var slideIdx = this._blogState.saved_locations[this._blogState.sections[sectionIdx].name];
		return this._blogState.sections[sectionIdx].slides[slideIdx];
	},

	/**
	 * Return the URL above the current URL
	 *
	 * @returns URL of the slide above if present. Else null
	 */
	getUpURL: function() {
		if (!this._blogState.sections
				|| !this._blogState.saved_locations
				|| !this._blogState.current_idx
				|| this._blogState.current_idx[1] === 0) {
			return null;
		}
		var sectionIdx = this._blogState.current_idx[0];
		var slideIdx = this._blogState.current_idx[1] - 1;
		return this._blogState.sections[sectionIdx].slides[slideIdx];
	},

	/**
	 * Return the URL below the current URL
	 *
	 * @returns URL of the slide below if present. Else null
	 */
	getDownURL: function() {
		if (!this._blogState.sections
				|| !this._blogState.saved_locations
				|| !this._blogState.current_idx
				|| (this._blogState.current_idx[1]
					>= this._blogState.sections[this._blogState.current_idx[0]].slides.length-1)) {
			return null;
		}
		var sectionIdx = this._blogState.current_idx[0];
		var slideIdx = this._blogState.current_idx[1] + 1;
		return this._blogState.sections[sectionIdx].slides[slideIdx];
	},

	/**
	 * API method to serialize data to the client
	 */
	dehydrate: function() {
		return {
			blogState: this._blogState
		};
	},

	/**
	 * API method to deserialize data at the client
	 */
	rehydrate: function(state) {
		this._blogState = state.blogState;
	}
});

module.exports = BlogStateStore;
