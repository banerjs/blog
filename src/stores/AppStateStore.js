// Store for the state of the application
var createStore = require('fluxible/addons/createStore');
var labels = require('../actions');

// Debug
var debug = require('debug')('blog:server');

// Constants
DEFAULT_TITLE = "Siddhartha Banerjee";
DEFAULT_TITLE_SEPARATOR = " | ";
DEFAULT_PAGE_CSS = "banerjs.css";
DEFAULT_PAGE_CSS_PATH = "/public/css/";

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
	handlers[labels.UPDATE_SECTIONS] = 'handleUpdateSections';
	return handlers;
};

// First create the store prototype by extending the BaseStore prototype
var AppStateStore = createStore({
	/**
	 * Recommended Fluxible field for name of the store
	 */
	storeName: 'AppStateStore',

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
		this._appState = {};
	},

	/**
	 * This method handles the completion of the 'FETCH_POST' action. The store
	 * only updates the post if that post is the current post being displayed
	 *
	 * @param data The data returned from fetching the post. It has 2 fields,
	 *	data.url and data.post
	 */
	handleFetchedPost: function(data) {
		if (data.url === this._appState.current_url) {
			this._appState.page_css = data.post.css;
			this._appState.page_title = data.post.title;
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
		if (!!this._appState.sections) {
			// Create the saved locations if they don't exist
			if (!this._appState.saved_locations) {
				this._appState.saved_locations = {};
				for (i = 0; i < this._appState.sections.length; i++) {
					this._appState.saved_locations[this._appState.sections[i].name] = 0;
				}
			}

			// Update the pointers to the states
			var indices = findSectionSlide(data.url, this._appState.sections);
			if (indices[0] === null || indices[1] === null) {
				var error = new Error("The sections are unaware of this URL");
				throw error;
			}
			this._appState.saved_locations[this._appState.sections[indices[0]].name] = indices[1];
			this._appState.current_idx = indices;
		}

		this._appState.current_url = data.url;
		this._appState.page_css = data.css;
		this._appState.page_title = data.title;
		this.emitChange();
	},

	/**
	 * This method handles the completion of an 'UPDATE_SECTIONS' action
	 *
	 * @param data The new sections that are in the app
	 */
	handleUpdateSections: function(data) {
		this._appState.sections = data;

		// Create the saved location and current indices if they don't exist
		if (!this._appState.current_idx) {
			this._appState.current_idx = findSectionSlide(this._appState.current_url, data);
		}

		if (!this._appState.saved_locations) {
			this._appState.saved_locations = {};
			for (i = 0; i < data.length; i++) {
				this._appState.saved_locations[data[i].name] = 0;
			}
			this._appState.saved_locations[data[this._appState.current_idx[0]].name] = this._appState.current_idx[1];
		}


		// Update the saved_location pointers if the sections have been changed
		for (i = 0; i < data.length; i++) {
			// Add a default of 0 if a section has been added
			if (!this._appState.saved_locations[data[i].name]) {
				this._appState.saved_locations[data[i].name] = 0;
			}

			// Reset to default if the state is at a section that no longer
			// exists
			if (this._appState.saved_locations[data[i].name] >= data[i].slides.length) {
				this._appState.saved_locations[data[i].name] = 0;
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
		return this._appState.current_url;
	},

	/**
	 * Return the title of the current page that the application is on
	 *
	 * @returns title
	 */
	getPageTitle: function() {
		// Default title
		if (!this._appState.page_title) {
			return DEFAULT_TITLE;
		}
		return this._appState.page_title + DEFAULT_TITLE_SEPARATOR + DEFAULT_TITLE;
	},

	/**
	 * Return the HTML needed on the CSS for this page
	 *
	 * @returns HTML for the custom CSS associated with a page
	 */
	getPageCSSTag: function() {
		if (!this._appState.page_css) {
			return createCSSLinkTag(DEFAULT_PAGE_CSS_PATH + DEFAULT_PAGE_CSS);
		}
		return createCSSLinkTag(DEFAULT_PAGE_CSS_PATH + this._appState.page_css);
	},

	/**
	 * Return the sections that the app is composed of
	 *
	 * @returns Sections as an array of objects
	 */
	getSections: function() {
		return this._appState.sections;
	},

	/**
	 * Return the URL to the left of the current URL
	 *
	 * @returns URL of the slide to the left if present. Else null
	 */
	getLeftURL: function() {
		if (!this._appState.sections
				|| !this._appState.saved_locations
				|| !this._appState.current_idx
				|| this._appState.current_idx[0] === 0) {
			return null;
		}
		var sectionIdx = this._appState.current_idx[0] - 1;
		var slideIdx = this._appState.saved_locations[this._appState.sections[sectionIdx].name];
		return this._appState.sections[sectionIdx].slides[slideIdx];
	},

	/**
	 * Return the URL to the right of the current URL
	 *
	 * @returns URL of the slide to the right if present. Else null
	 */
	getRightURL: function() {
		if (!this._appState.sections
				|| !this._appState.saved_locations
				|| !this._appState.current_idx
				|| this._appState.current_idx[0] >= this._appState.sections.length-1) {
			return null;
		}
		var sectionIdx = this._appState.current_idx[0] + 1;
		var slideIdx = this._appState.saved_locations[this._appState.sections[sectionIdx].name];
		return this._appState.sections[sectionIdx].slides[slideIdx];
	},

	/**
	 * Return the URL above the current URL
	 *
	 * @returns URL of the slide above if present. Else null
	 */
	getUpURL: function() {
		if (!this._appState.sections
				|| !this._appState.saved_locations
				|| !this._appState.current_idx
				|| this._appState.current_idx[1] === 0) {
			return null;
		}
		var sectionIdx = this._appState.current_idx[0];
		var slideIdx = this._appState.current_idx[1] - 1;
		return this._appState.sections[sectionIdx].slides[slideIdx];
	},

	/**
	 * Return the URL below the current URL
	 *
	 * @returns URL of the slide below if present. Else null
	 */
	getDownURL: function() {
		if (!this._appState.sections
				|| !this._appState.saved_locations
				|| !this._appState.current_idx
				|| (this._appState.current_idx[1]
					>= this._appState.sections[this._appState.current_idx[0]].slides.length-1)) {
			return null;
		}
		var sectionIdx = this._appState.current_idx[0];
		var slideIdx = this._appState.current_idx[1] + 1;
		return this._appState.sections[sectionIdx].slides[slideIdx];
	},

	/**
	 * API method to serialize data to the client
	 */
	dehydrate: function() {
		return {
			appState: this._appState
		};
	},

	/**
	 * API method to deserialize data at the client
	 */
	rehydrate: function(state) {
		this._appState = state.appState;
	}
});

module.exports = AppStateStore;
