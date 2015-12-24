var React = require('react');

var AdminActions = require('../actions/AdminActions');

// Debug
var debug = require('debug')('blog:server');

// Child Components
var InlineSectionEditor = require('./InlineSectionEditor');

/**
 * This component is the inline editor for the the sections displayed in the
 * StructureEditor
 */
var InlineSection = React.createClass({
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
	 * The component uses the state to switch between edit mode and display mode
	 */
	getInitialState: function() {
		return {
			editMode: false
		}
	},

	/**
	 * Callback for when the user is editing this section
	 */
	_beginEdit: function() {
		this.setState({ editMode: true });
	},

	/**
	 * Callback for when the user finishes editing the section
	 */
	_endEdit: function() {
		this.setState({ editMode: false });
		console.log(this.refs.editor.getSectionData());
	},

	/**
	 * Render the component
	 */
	render: function() {
		var component;
		var footer;

		if (this.state.editMode) {
			component = <InlineSectionEditor ref="editor" section={this.props.section} />;
			footer = (
				<div className="panel-footer text-center">
					<button className="btn btn-success" onClick={this._endEdit}>
					{"Done"}
					</button>
				</div>
			);
		} else if (!this.props.section) {
			component = (
				<div className="panel-body text-center"
					 style={{cursor: 'pointer'}}
					 onClick={this._beginEdit}>
					<span className="glyphicon glyphicon-plus"></span>
				</div>
			);
		} else {
			component = (
				<div className="panel-body text-left"
					 style={{cursor: 'pointer'}}
					 onClick={this._beginEdit}>
					<div className="row">
						<h1 className="col-sm-3 col-xs-12">{this.props.section.name}</h1>
						<h1 className="col-sm-9 col-xs-12"><small>{this.props.section.url}</small></h1>
					</div>
					<div className="row col-xs-12">
						<p>
						{this.props.section.slides.length + " Page"
							+ ((this.props.section.slides.length !== 1) ? "s" : "")}
						</p>
					</div>
				</div>
			);
		}
		return (
			<div className="panel panel-default">
				{component}
				{footer}
			</div>
		);
	}
});

module.exports = InlineSection;
