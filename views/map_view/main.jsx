var Header = React.createClass({
	render: function() {
		return (
			<header className="row page-header">
				<a href="/views/main.html" style={{color: "black"}}>
					<h1 className="col-xs-12 text-center">Siddhartha Banerjee <small><em><b>travelogue</b></em></small></h1>
				</a>
			</header>
		);
	}
});

var ArticleLink = React.createClass({
	render: function() {
		return (
			<span>
			<p className="article-title"><b><a href={this.props.article.link}>{this.props.article.title}</a></b></p>
			<p>{ (!!this.props.article.blurb) ? this.props.article.blurb : "" }</p>
			</span>
		);
	}
});

var CountryList = React.createClass({
	render: function() {
		var sectionId = this.props.country.toLowerCase().replace(/\s+/, "-");
		return (
			<section id={sectionId} className="bcg" data-bottom-top="background-position: 50% 40%" data-top-bottom="background-position: 50% 60%" data-anchor-target={"#" + sectionId + " .country-article-list"}>
				<div className="curtain">
					<div className="country-article-list col-xs-12 col-sm-offset-2 col-sm-8">
						<h3 className="text-center country-name">{this.props.country}</h3>
						<ul className="list-group">
							{this.props.articles.map(function(article, idx) {
								return <li key={article.title} className="list-group-item"><ArticleLink article={article} /></li>;
							})}
						</ul>
					</div>
				</div>
			</section>
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
			<main style={this.mapStyle}>
				<Header />
				<Map />
				{countryLists}
			</main>
		);
	}
});
