var articles = {
	"India": [
		{ "title": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.", "link": "" },
		{ "title": "Aliquam tincidunt mauris eu risus.", "link": "" },
		{ "title": "Vestibulum auctor dapibus neque.", "link": "" },
		{ "title": "Nunc dignissim risus id metus.", "link": "" },
		{ "title": "Cras ornare tristique elit.", "link": ""},
		{ "title": "Vivamus vestibulum nulla nec ante.", "link": ""},
		{ "title": "Praesent placerat risus quis eros.", "link": ""},
		{ "title": "Fusce pellentesque suscipit nibh.", "link": ""}
	],
	"United States": [
		{ "title": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.", "link": ""},
		{ "title": "Aliquam tincidunt mauris eu risus.", "link": "" },
		{ "title": "Vestibulum auctor dapibus neque.", "link": ""},
		{ "title": "Nunc dignissim risus id metus.", "link": ""}
	]
};

var Header = React.createClass({
	render: function() {
		return (
			<div className="page-header row">
				<h1 className="col-xs-offset-4 col-xs-4 text-center">Siddhartha Banerjee <small>travelogue</small></h1>
			</div>
		);
	}
});

var ArticleLink = React.createClass({
	render: function() {
		return (
			<p><a href={this.props.article.link}>{this.props.article.title}</a></p>
		);
	}
});

var CountryList = React.createClass({
	render: function() {
		return (
			<div>
				<h3>{this.props.country}</h3>
				<ul className="list-group">
					{this.props.articles.map(function(article) {
						return <li key={article.title} className="list-group-item"><ArticleLink article={article} /></li>;
					})}
				</ul>
			</div>
		);
	}
});

var Main = React.createClass({
	componentWillMount: function() {
		this.mapStyle = {
			height: "100%",
			margin: 0,
			padding: 0
		};
	},

	render: function() {
		var countryLists = [];
		for (var key in articles) {
			if (articles.hasOwnProperty(key)) {
				countryLists.push(
					<CountryList key={key} country={key} articles={articles[key]} />
				);
			}
		}
		return (
			<div style={this.mapStyle}>
				<Header />
				<div className="col-xs-offset-2 col-xs-8">
					{countryLists}
				</div>
			</div>
		);
	}
});
