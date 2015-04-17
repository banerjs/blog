/*
This is the basic page of a travelogue entry. It requires the presence of marked:

<script src="https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.2/marked.min.js" type="text/javascript"></script>

This needs to be up in the head portion of the html
*/

var article = {
	"title": "Lorem Ipsum",
	"location": "Budapest",
	"country": "Hungary",
	"date": "28th January 2015",
	"body":
"Lorem ipsum dolor sit amet, *consectetuer* adipiscing elit. Phasellus hendrerit. Pellentesque aliquet nibh nec urna. In nisi neque, aliquet vel, dapibus id, mattis vel, nisi. Sed pretium, ligula sollicitudin laoreet viverra, tortor libero sodales leo, eget blandit nunc tortor eu nibh. Nullam mollis. Ut justo. Suspendisse potenti.\n\
\n\
Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae luctus metus libero eu augue. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus. Praesent elementum hendrerit tortor. **Sed semper lorem at felis**. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, fermentum et, dapibus sed, urna.\n\
\n\
Morbi interdum mollis sapien. Sed ac risus. Phasellus lacinia, magna a ullamcorper laoreet, lectus arcu pulvinar risus, vitae facilisis libero dolor a purus. Sed vel lacus. [Mauris](https://google.com/) nibh felis, adipiscing varius, adipiscing in, lacinia vel, tellus. Suspendisse ac urna. Etiam pellentesque mauris ut lectus. Nunc tellus ante, mattis eget, gravida vitae, ultricies ac, leo. Integer leo pede, ornare a, lacinia eu, vulputate vel, nisl.\n\
\n\
Suspendisse mauris. Fusce accumsan mollis eros. Pellentesque a diam sit amet mi ullamcorper vehicula. Integer adipiscing risus a sem. Nullam quis massa sit amet nibh viverra malesuada. Nunc sem lacus, accumsan quis, faucibus non, congue vel, arcu. Ut scelerisque hendrerit tellus. Integer sagittis. Vivamus a mauris eget arcu gravida tristique. Nunc iaculis mi in ante. Vivamus imperdiet nibh feugiat est:\n\
\n\
- Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat.\n\
- Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.\n\
- Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.\n\
- Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc.\n\
- Sed adipiscing ornare risus. Morbi est est, blandit sit amet, sagittis vel, euismod vel, velit. Pellentesque egestas sem. Suspendisse commodo ullamcorper magna.\n\
- Nulla sed leo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.\n\
- Fusce lacinia arcu et nulla. Nulla vitae mauris non felis mollis faucibus.\n\
- Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede.\n\
\n\
Ut convallis, sem sit amet interdum consectetuer, odio augue aliquam leo, nec dapibus tortor nibh sed augue. Integer eu magna sit amet metus fermentum posuere. Morbi sit amet nulla sed dolor elementum imperdiet. Quisque fermentum. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Pellentesque adipiscing eros ut libero. Ut condimentum mi vel tellus. Suspendisse laoreet. Fusce ut est sed dolor gravida convallis. Morbi vitae ante. Vivamus ultrices luctus nunc. Suspendisse et dolor. Etiam dignissim. Proin malesuada adipiscing lacus. Donec metus. Curabitur gravida."

};

var Header = React.createClass({
	render: function() {
		return (
			<header className="page-header row">
				<a href="/views/main.html" style={{color: "black"}}>
					<h1 className="col-xs-12 text-center">Siddhartha Banerjee <small><em><b>travelogue</b></em></small></h1>
				</a>
			</header>
		);
	}
});

var Map = React.createClass({
	getInitialState: function() {
		return {
			mapStyle: {
				border: 0,
				pointerEvents: "none"
			}
		};
	},

	preventMouseScroll: function() {
		this.setState({
			mapStyle: {
				pointerEvents: "none"
			}
		});
	},

	allowMouseScroll: function() {
		this.setState({
			mapStyle: {
			}
		});
	},

	render: function() {
		return (
			<figure contentEditable="true" className="embed-responsive embed-responsive-16by9" onClick={this.allowMouseScroll} onBlur={this.preventMouseScroll}>
				<iframe width="100%" className="embed-responsive-item" frameBorder="0" style={this.state.mapStyle} src={"https://www.google.com/maps/embed/v1/place?key=AIzaSyCHYlpfQhn1ns_pkwlpUx5BMkuHc40Xisc&q=" + encodeURIComponent(this.props.location)} />
			</figure>
		);
	}
});

var Article = React.createClass({
	componentWillMount: function() {
		this.mapStyle = {
			margin: 0,
			padding: 0
		};
	},

	render: function() {
		return (
			<article style={this.mapStyle}>
				<section className="row">
					<Map location={this.props.article.location} />
				</section>
				<section className="col-xs-12 col-sm-offset-2 col-sm-8 col-lg-offset-3 col-lg-6">
					<div className="row">
						<h2>{this.props.article.title}<br/>
							<small>{this.props.article.date}, {this.props.article.location}, <span style={{ fontSize: "60%" }}>{this.props.article.country}</span></small>
						</h2>
					</div>
					<div className="row" dangerouslySetInnerHTML={{__html: marked(this.props.article.body, { sanitize: true })}}>
					</div>
				</section>
			</article>
		);
	}
})

var Main = React.createClass({
	componentWillMount: function() {
		this.mapStyle = {
			height: "100%",
			margin: 0,
			padding: 0
		};
	},

	render: function() {
		return (
			<main style={this.mapStyle}>
				<Header />
				<Article article={article} />
			</main>
		);
	}
});
