var React = require('react');

var AppStateStore = require('../stores/AppStateStore');
var BlogActions = require('../actions/BlogActions');

// Debug
var debug = require('debug')('blog:server');

/**
 * This is the class for the Section Navigation element
 */
var NavigationSection = React.createClass({
	/**
	 * Required React field for passing context to the components. This context
	 * is hydrated by Fluxible.
	 */
	contextTypes: {
		getStore: React.PropTypes.func.isRequired,
		executeAction: React.PropTypes.func.isRequired,
		history: React.PropTypes.object
	},

	/**
	 * Type checking for the properties being passed into the component
	 */
	propTypes: {
		style_class: React.PropTypes.string,
		home: React.PropTypes.string.isRequired,
		sections: React.PropTypes.array.isRequired
	},

	/**
	 * Initialize the state to a single variable (for now) which stores if the
	 * mouse is hovering over the home button
	 */
	getInitialState: function() {
		return { mouseOnHome: false };
	},

	/**
	 * Mouse Enter Handler on the home icon
	 */
	_showSections: function() {
		this.setState({ mouseOnHome: true });
	},

	/**
	 * Mouse Leave Handler on the home icon
	 */
	_hideSections: function() {
		this.setState({ mouseOnHome: false });
	},

	/**
	 * Render the component with the given sections from the Navigation
	 * component
	 */
	render: function() {
		var homeClass = "glyphicon glyphicon-home";
		var sectionLinks = this.props.sections.map(function(section, idx) {
			return (
				<a key={idx}
					 className={(this.state.mouseOnHome) ? "" : "hidden"}
					 style={{color: "inherit"}}
					 href={section.url}>
					<span>{section.name}</span>
				</a>
			);
		}, this);

		return (
			<div className={this.props.style_class}
				 onMouseEnter={this._showSections}
				 onMouseLeave={this._hideSections}>
				{sectionLinks}
				<a href={this.props.home} style={{color: "inherit"}}>
					<span className={homeClass}></span>
				</a>
			</div>
		);
	}
});

module.exports = NavigationSection;
