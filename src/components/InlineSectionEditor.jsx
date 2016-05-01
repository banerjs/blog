var $ = require('jquery');
var React = require('react');

var constants = require('../utils/constants');
var AdminActions = require('../actions/AdminActions');

// Debug
var debug = require('debug')('blog:server');

// Add in the serializer
if (typeof window !== 'undefined') {
	require('form-serializer');
}

/**
 * This component is the inline editor for the the sections displayed in the
 * StructureEditor
 */
var InlineSectionEditor = React.createClass({
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
	 * The component expects an optional section
	 */
	propTypes: {
		section: React.PropTypes.object
	},

	/**
	 * The parent component can call into this method to get the latest form
	 * data
	 */
	getSectionData: function() {
		if (typeof window === 'undefined') { return null; }
		return $(this.refs.form).serializeObject();
	},

	/**
	 * This is the callback that initiates the process of letting the user edit
	 * the pages in a section
	 */
	_editSection: function(event) {
		event.preventDefault();
		this.context.history.push(constants.ADMIN_SECTIONS_URL + this.props.section.url);
	},

	/**
	 * Render the component
	 */
	render: function() {
		// Create a stub empty object for the case of adding a new section
		var section = this.props.section || {};

		// Allow the editing of slides only if this section exists
		var slideEdit;
		if (!$.isEmptyObject(section)) {
			slideEdit = (
				<div className="form-group">
					<label className="col-sm-2 control-label">{"Pages"}</label>
					<div className="col-sm-10 text-left">
						<button className="btn btn-primary" onClick={this._editSection}>
						{"Edit " + section.slides.length + " Page"
							+ ((section.slides.length !== 1) ? "s": "")}
						</button>
					</div>
				</div>
			);
		}

		return (
			<div className="panel-body">
			<form className="form-horizontal" ref={"form"}>
				<div className="form-group form-group-lg">
					<label htmlFor="name" className="col-sm-2 control-label">{"Name"}</label>
					<div className="col-sm-10">
						<input type="text"
							   className="form-control"
							   name="name"
							   placeholder="Name"
							   defaultValue={section.name}>
						</input>
					</div>
				</div>
				<div className="form-group">
					<label htmlFor="url" className="col-sm-2 control-label">{"URL"}</label>
					<div className="col-sm-10">
						<input type="text"
							   className="form-control"
							   name="url"
							   placeholder="/name"
							   defaultValue={section.url}>
						</input>
					</div>
				</div>
				<div className="form-group">
					<label htmlFor="priority" className="col-sm-2 control-label">{"Priority"}</label>
					<div className="col-sm-10">
						<input type="number"
							   className="form-control"
							   name="priority"
							   placeholder="100"
							   defaultValue={section.priority}>
						</input>
					</div>
				</div>
				<div className="form-group">
					<label htmlFor="index_filename" className="col-sm-2 control-label">{"Index Filename"}</label>
					<div className="col-sm-10">
						<input type="text"
							   className="form-control"
							   name="index_filename"
							   defaultValue={section.index_filename}>
						</input>
					</div>
				</div>
				{slideEdit}
				<div className="form-group">
					<input type="hidden"
						   name="id"
						   defaultValue={section.id}>
					</input>
				</div>
			</form>
			</div>
		);
	}
});

module.exports = InlineSectionEditor;
