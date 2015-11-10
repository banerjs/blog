var React = require('react');
var Section = require('./Section');
var Slide = require('./Slide');

/**
 * This is the main page of the website. It preloads the different sections and
 * slides of the website, but it leaves the fetch of the content upto the
 * individual section or slide. Periodically, the body updates its cache of the
 * different sections and slides present on the website through AJAX requests.
 */
var Body = React.createClass({
	render: function() {
		return (
			<div id="fullpage">
				<Section>
					<Slide htmlClassName="text-center" idName="home">
						<h1>Siddhartha Banerjee<br/><small>Robotics Ph.D. candidate at Georgia Tech</small></h1>
					</Slide>
					<Slide idName="about"><div className="container"><h2>About</h2></div></Slide>
					<Slide idName="contact"><div className="container"><h2>Contact</h2></div></Slide>
				</Section>
			</div>
		);
	}
});

module.exports = Body;
