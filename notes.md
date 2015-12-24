# To start

- Start from Windows: `docker-machine.exe env --shell powershell default | Invoke-Expression`
- Start a new web container with the following command: `docker run --name blog -i -t -v /c/Users/Siddhartha/Documents/Code/blog/:/usr/src/ -w /usr/src/ -p 8000:8000 --rm node:4 bash`
  - Note that problems with browserify and ejsify for auth0 means that we have to use node 4.x
- Start a new postgres container `docker run --name blog-pg -d -v /tmp/blog/:/var/lib/postgresql/data -P -e POSTGRES_PASSWORD=a postgres`
  - Note the container uses the folder /tmp in the virtual machine as a data directory. This is not accessible from windows
  - Use `docker network inspect bridge` to figure out the IP address of the new container
  - Run `export DATABASE_URL="<postgres url of database>"` in the node container shell running the server
- Start a new redis container `docker run --name blog-redis -d -P redis`
  - Note that we do not want persistent storage on redis; at least not yet
  - Use `docker network inspect bridge` to figure out the IP address of the new container
  - Run `export REDIS_URL="<redis url of the database>"` in the node container shell running the server
- Run the npm installer to get all project dependencies: `./install_deps_globally.sh package.json`
- Clean and start gulp in watch mode: `npm run clean; npm run gulp &`
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
- Fullpage slide-like functionality [fullPage](https://github.com/alvarotrigo/fullPage.js)
- [HTML Semantic Tags](http://html5doctor.com/downloads/h5d-sectioning-flowchart.pdf)
- [Parallax Scrolling](https://ihatetomatoes.net/how-to-create-a-parallax-scrolling-website/)
- GIF Creation - [Spiffygif](http://spiffygif.com/)
- React Starter [Docs](https://github.com/webpack/react-starter/blob/master/NOTES/HowStuffWorks.md)
- Gulp Starters - [Gist](https://gist.github.com/mlouro/8886076), [Boilerplate](https://github.com/christianalfoni/react-app-boilerplate/blob/master/gulpfile.js)
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
- [Pixlr](https://pixlr.com/) is an excellent online image editing platform
- [Fluxible](http://fluxible.io/) seems like a promising place for creating a Flux data flow. [This](https://github.com/yahoo/fluxible/blob/master/docs/blog/2014-11-06-bringing-flux-to-the-server.md) seems like a decent tutorial on using Fluxible

# Features

- Animations
- Migrate to ES6
- Create Unit Tests
- Add in Timeouts to the fetch code. While Promise.race is a viable option, there already exists express middleware capable of doing this
- Help page for keyboard shortcuts
- Migrate to OpenShift and scalable infrastructure
- Configure the docker-compose files necessary to start all the different containers at the same time
- Templating of the HTML stored in the DB
- Structure editing similar to Trello
- Better routing in the Admin section (Routing using constants in the Actions is distressing)

# Todo

- Create a way to initialize data sources
- Create a way to add to the data source
- Complete the admin section
  - Allow editing of sections
    - Create XHR endpoints for the edits
    - Hook up the XHR endpoints to the data sources
  - Allow editing of posts
    - Complete the portal to edit the page
    - Create the UI for editing the page
    - Create the XHR endpoints for the edits
    - Hook up the endpoints to the data sources
