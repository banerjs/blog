# To start

- startup a new container with the following command: `docker run -i -t -v /c/Users/Siddhartha/Documents/Personal/Code/blog/:/usr/src/ -w /usr/src/ -p 8000:8000 --rm node:slim bash`
- Run the npm installer to get all project dependencies: `. install_deps_globally.sh package.json`
- Clean and start gulp in watch mode: `gulp clean; gulp &`
- Start the server in debug: `npm run debug`

# Resources

- Google Maps styling: [SnazzyMaps](https://snazzymaps.com/)
- Blog styles:
  - [CMarsh](http://www.crmarsh.com/script/)
  - [Justin](http://www.justinyan.com/posts/2015/self-esteem/)
  - [Paravel Founder Sites](http://paravelinc.com/about.php)
    - [Trent Walton](http://trentwalton.com/)
    - [Dave Rupert](http://daverupert.com/)
- Bootstrap Themes: [Bootswatch](https://bootswatch.com/)
- Online Shapefile Viewer: [Mapshaper](http://www.mapshaper.org/)
- Countries Data: [Data OKFN](http://data.okfn.org/data/datasets/geo-boundaries-world-110m), [Google Groups](https://groups.google.com/forum/#!topic/d3-js/cTVo0Uci5x4), **[Stack Overflow](http://stackoverflow.com/questions/9542834/geojson-world-database)**
- Not using this yet... but perhaps I should? [fullPage](https://github.com/alvarotrigo/fullPage.js)
- [HTML Semantic Tags](http://html5doctor.com/downloads/h5d-sectioning-flowchart.pdf)
- [Parallax Scrolling](https://ihatetomatoes.net/how-to-create-a-parallax-scrolling-website/)
- GIF Creation - [Spiffygif](http://spiffygif.com/)
- React Starter [Docs](https://github.com/webpack/react-starter/blob/master/NOTES/HowStuffWorks.md)
- Gulp Starters - [Gist](https://gist.github.com/mlouro/8886076), [Boilerplate](https://github.com/christianalfoni/react-app-boilerplate/blob/master/gulpfile.js)
- Tried using [gulp-reacss](https://github.com/yodairish/gulp-reacss). Failed. I believe the API is not fully fleshed out yet. However, it does give me the means of trying to use the [css](https://github.com/reworkcss/css) library should I desire to do so.
- Setting up PG - [node-postgres](https://github.com/brianc/node-postgres) and [pg-promise](https://github.com/vitaly-t/pg-promise) alongwith [pg-monitor](https://github.com/vitaly-t/pg-monitor). The reason I'm not using firebase/mongo are because of pricing, lookup latencies and storage restrictions when deploying on Heroku. On Openshift, this would not be a problem, but the setup there takes longer.
- For posterity's sake, here were a few data sources that I was considering a while back:
  - [Firebase](https://www.firebase.com/) - Excellent API and libraries
  - [MyJSON](http://myjson.com/) - Free and very easy to use
  - MongoDB - this comes free(ish) with hosting
  - Postgres - harder to model flexible data. But also free-ish
  - Filesystem - cheapest option. Probably not the most performant though
- Free Stock Photos - [Unsplash](https://unsplash.com/)
- Online Image Compression - [CompressJPEG](http://compressjpeg.com/) and [TinyPNG](https://tinypng.com/)
- Glyphs from [WebHostingHub](http://www.webhostinghub.com/glyphs/)

# Todo

- Create Homepage
  - Design the activities and landing page
    - Fix the CSS
    - Content
    - Images (Stock photos for now)
  - Get the design vetted by Mike
- Deploy to Heroku

This will be the new face of banerjs.com. However, it will still not be "deploy worthy at this point"

- Curate personal HQ images
- Create Postgres hookups
  - Initiate a DB connection (pool) when the app starts so that requests can utilize this pool
  - Initiate and close transactions for the API section automatically. Be careful to do this only when routes match
  - Initialize the data in the databases
- Create Stores and Actions
  - Needed for easy update through the APIs
  - Would help cement the Flux model
- Recreate Blog and Travelogue design
  - Includes the addition of Skrollr
  - Includes preserving the responsiveness that the mocks lacked
- Curate actual content for the blog
- Create unit tests and setup the Travis CI build hook

At this point the webapp is deploy worthy. Once this milestone is reached:

- Create mongo/firebase and file system hookups
  - Needed (in the long run) for the places data and arbitrary schema documents that we want to query using a *single key*
  - Associations and multiple lookup methods can be stored on postgres
  - Migration to OpenShift is also an option
- Use [Mapstraction](http://mapstraction.com/) to ensure agnostic maps
- Enhance API/UI
  - Include authorization
  - Include ability to create new content
- Docker-ize webapp
- Create Error Pages
- Modify document title on the server

# Data Model

With the use of PG, the old data model has been invalidated. Time to now create data models (and stores that the application can actually use).

There will be 3 kinds of stores:

1. PostStore - this store will contain all the data in the blog post/page that needs to be rendered from markdown
1. PostListStore - this store will contain the available list of posts segregated based on arbitrary criteria
1. PlaceStore - this store will contain the metadata about the countries/places that a travelogue section article may talk about

The format of the data for each of these stores is thus as follows:

PostStore:

// TODO

PostListStore:

// TODO

PlaceStore:

// TODO

**OLD CONTENT**

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
