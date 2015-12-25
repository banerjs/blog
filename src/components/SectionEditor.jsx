var React = require('react');

var constants = require('../utils/constants');
var AdminActions = require('../actions/AdminActions');

// Debug
var debug = require('debug')('blog:server');

// Child Components
var InlinePage = require('./InlinePage');
var StructureButton = require('./StructureButton');
var LogoutButton = require('./LogoutButton');

/**
 * This is component allows a user to view the pages that are a part of the
 * section as well as initiate the process of editing them
 */
var SectionEditor = React.createClass({
	/**
	 * Required React field for passing context to the components. This context
	 * is hydrated by ContextWrapper.
	 */
	contextTypes: {
		getStore: React.PropTypes.func.isRequired,
		executeAction: React.PropTypes.func.isRequired,
		history: React.PropTypes.object
	},

	/**
	 * This component is passed in one prop - the section being edited
	 */
	propTypes: {
		section: React.PropTypes.object.isRequired
	},

	/**
	 * Update the page's title
	 */
	componentDidMount: function() {
		document.title = this.props.section.name + constants.DEFAULT_TITLE_SEPARATOR
							+ constants.DEFAULT_ADMIN_TITLE;
	},

	/**
	 * Render the component
	 */
	render: function() {
		// First create the set of all the slides that need to be displayed
		var pages = !!this.props.section.slides
						&& this.props.section.slides.map(function(slideUrl, idx) {
							return (
								<InlinePage url={slideUrl} key={idx} />
							);
						});

		// Then simply return the formatted HTML
		return (
			<div className="container">
				<div className="page-header">
					<div className="row">
					<div className="col-sm-8 col-xs-12 text-left">
						<h1>{this.props.section.name}</h1>
					</div>
					<div className="col-sm-4 col-xs-12 text-right">
						<div className="btn-group">
						<StructureButton />
						<LogoutButton />
						</div>
					</div>
					</div>
				</div>
				<ul className="list-group">
					{pages}
				</ul>
			</div>
		);
	}
});

module.exports = SectionEditor;
