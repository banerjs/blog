# To start

- startup a new container with the following command: `docker run -i -t -v /c/Users/Siddhartha/Documents/Personal/Code/blog/:/usr/src/ -w /usr/src/ -p 8000:8000 --rm node:slim bash`
- Run the npm installer to get all project dependencies: `. install_deps_globally.sh package.json`
- Clean and start gulp in watch mode: `gulp clean; gulp &`
- Start the server in debug: `npm run debug`

# Activity Notes

### Just completed

- Initial SSR of a webpage through browserify, gulp, express and React.
- Build system made more robust
- All files are now served through the webserver

### Left to complete

- Allow modification of the title in the server
- Creation of React Router
- Creation of isomorphic components
- Creation of Stores and Actions for this SSR

# Resources

- Google Maps styling: [SnazzyMaps](https://snazzymaps.com/)
- Blog styles: [CMarsh](http://www.crmarsh.com/script/), [Justin](http://www.justinyan.com/posts/2015/self-esteem/)
- Bootstrap Themes: [Bootswatch](https://bootswatch.com/)
- Online Shapefile Viewer: [Mapshaper](http://www.mapshaper.org/)
- Countries Data: [Data OKFN](http://data.okfn.org/data/datasets/geo-boundaries-world-110m), [Google Groups](https://groups.google.com/forum/#!topic/d3-js/cTVo0Uci5x4), **[Stack Overflow](http://stackoverflow.com/questions/9542834/geojson-world-database)**
- Not using this yet... but perhaps I should? [fullPage](https://github.com/alvarotrigo/fullPage.js)
- [HTML Semantic Tags](http://html5doctor.com/downloads/h5d-sectioning-flowchart.pdf)
- [Parallax Scrolling](https://ihatetomatoes.net/how-to-create-a-parallax-scrolling-website/)
- GIF Creation - [Spiffygif](http://spiffygif.com/)
- React Starter [Docs](https://github.com/webpack/react-starter/blob/master/NOTES/HowStuffWorks.md)
- Gulp Starters - [Gist](https://gist.github.com/mlouro/8886076), [Boilerplate](https://github.com/christianalfoni/react-app-boilerplate/blob/master/gulpfile.js)
- According to the React best practices, it is preferable to use inline styles with react than to have classes. I quite agree, except, it's MUCH easier to affect classes equally with cross browser support with bootstrap than it is with React. Therefore, for this blog, I'm choosing a hybrid approach
- Tried using [gulp-reacss](https://github.com/yodairish/gulp-reacss). Failed. I believe the API is not fully fleshed out yet. However, it does give me the means of trying to use the [css](https://github.com/reworkcss/css) library should I desire to do so.

# Todo

- Create page design
  - ~~Travelogue Mock~~
  - ~~Skrollr-ize the mocks. Easy addition of skrollr pages~~
    - ~~Add better animation for country name & image entry (slide 6 in examples)~~
    - Auto hide and show map when data loads
      - Use Flux pattern
  - Create mocks for general blog
  - Create Navigation
  - Make responsive
- Create isomorphic webapp
  - Create modular models. Includes configuring data source(s)
    - [Firebase](https://www.firebase.com/) - Excellent API and libraries
    - [MyJSON](http://myjson.com/) - Free and very easy to use
    - MongoDB - this comes free(ish) with hosting
    - Postgres - harder to model flexible data. But also free-ish
    - Filesystem - cheapest option. Probably not the most performant though
  - Create modular React components
    - Build on Flux pattern in page mocks
- Wrap style and required scripts together
  - Separate out styles into CSS files, etc.
  - Include ability to require CSS (webpack)
- Create a Travis CI build hook

At this point the webapp is deploy worthy. Once this milestone is reached:

- Allow easy SSR
  - Webpack include of scripts and CSS
  - Non-render of Google Maps on the server side (trivial?)
- Use [Mapstraction](http://mapstraction.com/) to ensure agnostic maps
- Edit API/UI
  - Authentication
  - Utilize apps perhaps
- Docker-ize webapp
- Create Error Pages

# Data Model

	countries: {
		url: {
			name,
			abbr,
			properties,
			geometry (geo),
			has_been_visited,
			posts: [{
				title,
				url,
				date,
				blurb
			}, ...]
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
