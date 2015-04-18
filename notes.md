# Resources

- Google Maps styling: [SnazzyMaps](https://snazzymaps.com/)
- Blog styles: [CMarsh](http://www.crmarsh.com/script/), [Justin](http://www.justinyan.com/posts/2015/self-esteem/)
- Bootstrap Themes: [Bootswatch](https://bootswatch.com/)
- Online Shapefile Viewer: [Mapshaper](http://www.mapshaper.org/)
- Countries Data: [Data OKFN](http://data.okfn.org/data/datasets/geo-boundaries-world-110m), [Google Groups](https://groups.google.com/forum/#!topic/d3-js/cTVo0Uci5x4), **[Stack Overflow](http://stackoverflow.com/questions/9542834/geojson-world-database)**
- Not using this yet... but perhaps I should? [fullPage](https://github.com/alvarotrigo/fullPage.js)
- [HTML Semantic Tags](http://html5doctor.com/downloads/h5d-sectioning-flowchart.pdf)
- [Parallax Scrolling](https://ihatetomatoes.net/how-to-create-a-parallax-scrolling-website/)

# Todo

- Create page design
  - ~~Travelogue Mock~~
  - Skrollr-ize the mocks. Easy addition of skrollr pages
    - Add better animation for country name & image entry (slide 6 in examples)
  - Create mocks for general blog
  - Create Navigation
- Create isomorphic webapp
  - Create modular models. Includes configuring data source(s)
    - [Firebase](https://www.firebase.com/) - Excellent API and libraries
    - [MyJSON](http://myjson.com/) - Free and very easy to use
    - MongoDB - this comes free(ish) with hosting
    - Postgres - harder to model flexible data. But also free-ish
    - Filesystem - cheapest option. Probably not the most performant though
  - Create modular React components
- Wrap style and required scripts together
  - Separate out styles into CSS files, etc.
  - Include ability to require CSS (webpack)

At this point the webapp is deploy worthy. Once this milestone is reached:

- Allow easy SSR
  - Webpack include of scripts and CSS
  - Non-render of Google Maps on the server side (trivial?)
- Use [Mapstraction](http://mapstraction.com/) to ensure agnostic maps
- Edit API/UI
  - Figure out authentication
  - Utilize apps perhaps
- Docker-ize webapp

# Data Model

	countries: {
		url: {
			name,
			abbr,
			properties,
			geometry (geo),
			has_been_visited,
			posts: [full_url, ...]
		}, ...
	},
	posts: {
		year: {
			month: {
				day: {
					url: {
						title,
						content: [{
							type,
							data,
							properties (obj)
						}, ...],
						locations(?): [{
							name,
							country
						}, ...]
					}, ...
				}, ...
			}, ...
		}, ...
	}
