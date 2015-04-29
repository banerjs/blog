// Homepage
var React = require('react');

var Test = React.createClass({
	render: function() {
		return (
			<section>
<p className="lead">Donec condimentum est erat, sed vestibulum enim ullamcorper sed. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam volutpat ante rhoncus magna pharetra elementum sed sit amet nunc. Etiam ut eleifend lorem, id hendrerit lacus. Morbi vel pharetra quam. Vestibulum feugiat ex nec faucibus vehicula. In hac habitasse platea dictumst. Praesent tempor ex nec erat laoreet egestas. In ac vulputate risus.</p>

<p>Duis viverra eleifend velit, et lobortis dui volutpat ac. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nunc magna purus, facilisis at euismod et, euismod ut enim. Suspendisse iaculis lorem nulla, non feugiat eros bibendum eu. In vitae molestie orci. Nullam eu sollicitudin enim. Donec auctor ullamcorper dui non bibendum. Sed eget ornare velit. Quisque convallis sit amet elit non faucibus. Pellentesque condimentum mauris quis orci fermentum, in commodo dui lobortis. Nam efficitur ultricies mollis. Vestibulum lobortis varius purus. Duis id orci id dolor pellentesque sodales eu id erat. Donec accumsan id sem sit amet finibus.</p>

<p>Proin gravida tristique posuere. Donec enim elit, sagittis vitae ultrices id, viverra a massa. Vivamus porttitor accumsan est vitae facilisis. Morbi sed sem nec tellus molestie ullamcorper. Integer est turpis, sollicitudin ac arcu sed, rhoncus euismod odio. Nam egestas lobortis dui, vitae pretium erat. Donec faucibus pharetra tellus, non tristique ex dapibus et. Suspendisse venenatis quis felis sit amet porta. Sed hendrerit mattis iaculis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin pellentesque elementum mauris vel consequat. Ut bibendum libero ac magna bibendum sodales. Sed interdum mauris et mattis mattis. Nunc eu interdum est. In suscipit risus eget efficitur bibendum. Suspendisse at dui nec tellus malesuada euismod.</p>

<p>Nam nisi augue, convallis vel condimentum ac, lobortis sed ligula. Phasellus placerat maximus tortor, id tincidunt sem efficitur eu. Sed pulvinar vehicula efficitur. Nullam scelerisque feugiat orci sit amet pharetra. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam tempor nibh dolor, a mattis tellus dictum non. Nam eget tempus odio. Maecenas eget ante vel sapien sollicitudin ultrices id eget lectus. Pellentesque accumsan mauris at nulla sodales, sed imperdiet quam fermentum. Mauris ac nisi elit. Praesent ex magna, elementum at urna ac, ullamcorper maximus enim. Etiam tristique mi et tincidunt viverra. Sed iaculis mi et odio pulvinar lacinia. Ut consectetur, urna at molestie feugiat, quam nunc tincidunt lorem, a convallis massa lorem a mi. Nunc pellentesque, diam sed rhoncus venenatis, urna lorem ultricies urna, ut ultrices augue ex nec tortor.

Nam aliquet, dolor eget cursus iaculis, eros massa eleifend ante, quis accumsan sapien dolor sed odio. Nunc feugiat rhoncus laoreet. Etiam tristique dui nisl, eu fermentum dolor blandit non. Integer pellentesque auctor libero, hendrerit malesuada felis convallis eu. Curabitur ullamcorper felis nisi, sit amet tincidunt nulla vehicula nec. Curabitur ultricies nulla a maximus congue. Mauris facilisis sem ut libero sagittis, elementum interdum augue lacinia. Nam pharetra arcu mi, non laoreet neque mattis molestie. In quis venenatis nibh, eu euismod neque. Donec aliquam congue justo, ut tincidunt nisl sodales ut. Aliquam erat volutpat. Fusce commodo libero metus, in scelerisque purus pellentesque nec. Vivamus vehicula ultricies diam vitae blandit.</p></section>
		);
	}
})

var Homepage = React.createClass({
	contextTypes: {
		router: React.PropTypes.func
	},

	getInitialState: function() {
		return { section: this.toggleSection() };
	},

	toggleSection: function() {
		if (this.context.router.getCurrentRoutes()[1].name === "home") {
			return null;
		} else {
			return <Test />;
		}
	},

	render: function() {
		return (
			<main>
				<section>
					<p>This is some random text</p>
				</section>
				<section>
					<p>As is this</p>
				</section>
				{ this.state.section }
			</main>
		);
	}
});

module.exports = Homepage;
