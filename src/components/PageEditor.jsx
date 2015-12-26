var React = require('react');

var constants = require('../utils/constants');
var AdminActions = require('../actions/AdminActions');

// Debug
var debug = require('debug')('blog:server');

// Child components
var SectionButton = require('./SectionButton');
var StructureButton = require('./StructureButton');
var LogoutButton = require('./LogoutButton');

/**
 * This is the component that presents the login form to the application. It
 * also handles any necessary authentication before redirecting the user to the
 * appropriate page in the event of a successful login
 */
var PageEditor = React.createClass({
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
		section: React.PropTypes.object.isRequired,
		slide: React.PropTypes.object.isRequired
	},

	/**
	 * Update the page's title
	 */
	componentDidMount: function() {
		document.title = this.props.slide.title + " Page"
							+ constants.DEFAULT_TITLE_SEPARATOR
							+ constants.DEFAULT_ADMIN_TITLE;
	},

	/**
	 * Render the component
	 */
	render: function() {
		return (
			<div className="container">
				<div className="page-header">
					<div className="row">
					<div className="col-sm-6 col-xs-12 text-left">
						<h1>{this.props.section.name}</h1>
					</div>
					<div className="col-sm-6 col-xs-12 text-right">
						<div className="btn-group">
						<SectionButton section={this.props.section} />
						<StructureButton />
						<LogoutButton />
						</div>
					</div>
					</div>
				</div>
				<form ref={"form"}>
					<div className="form-group form-group-lg">
						<label htmlFor="title" className="control-label">{"Title"}</label>
						<input type="text"
							   className="form-control"
							   name="title"
							   placeholder="Title"
							   defaultValue={this.props.slide.title}>
						</input>
					</div>
					<div className="form-group">
						<label htmlFor="url" className="control-label">{"URL"}</label>
						<input type="text"
							   className="form-control"
							   name="url"
							   placeholder="/title"
							   defaultValue={this.props.slide.url}>
						</input>
					</div>
					<div className="form-group">
						<label htmlFor="css" className="control-label">{"CSS"}</label>
						<input type="text"
							   className="form-control"
							   name="css"
							   placeholder="/section/css.css"
							   defaultValue={this.props.slide.css}>
						</input>
					</div>
					<div className="form-group">
						<label htmlFor="html" className="control-label">{"HTML"}</label>
						<textarea className="form-control"
								  name="html"
								  placeholder="<div>Random Words on the Page</div>"
								  rows="20"
								  defaultValue={this.props.slide.html}>
						</textarea>
					</div>
					<button className="btn btn-default">{"Submit"}</button>
				</form>
			</div>
		);
	}
});

module.exports = PageEditor;
