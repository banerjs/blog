# To start

- start from Windows: `docker-machine.exe env --shell powershell default | Invoke-Expression`
- startup a new container with the following command: `docker run -i -t -v /c/Users/Siddhartha/Documents/Code/blog/:/usr/src/ -w /usr/src/ -p 8000:8000 --rm node bash`
- Get and start screen: `apt-get update && apt-get install screen dialog` followed by `screen`
- Run the npm installer to get all project dependencies: `. install_deps_globally.sh package.json`
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
- [Paletton](http://paletton.com/) allows for an easy way to generate colour palettes. The colours that go with the text colour for the Readable Bootstrap theme are:
  - #030303
  - #020202
  - #646464
  - #393939
  - #020101
- [Pixlr](https://pixlr.com/) is an excellent online image editing platform
- [Fluxible](http://fluxible.io/) seems like a promising place for creating a Flux data flow. [This](https://github.com/yahoo/fluxible/blob/master/docs/blog/2014-11-06-bringing-flux-to-the-server.md) seems like a decent tutorial on using Fluxible

# Feature Requests

- Animations
- Migrate to ES6
- Common CSS for different sections should go into a sections folder in CSS. Files in here should be included using SASS for the individual pages.
- Create Unit Tests
- Add in Timeouts to the fetch code. While Promise.race is a viable option, there already exists express middleware capable of doing this
- Error Pages. Display error page when XHR fails
- Help page for keyboard shortcuts

# Todo

- Create content for the about page
- Create design for the slides
- Plug in a proper data source
- Flesh out the routes
- Setup passport and sessions
  - Choose between Google, MSFT, and local logins

# Data Model

OBSOLETE!!

The data model does the following:

- Specify the internal HTML for a section
- Affect the CSS for a section (most notably background colour)
- Send this HTML through AJAX requests
- Differentiate between section and slide

The following JSON is available to the client. Based on the type of query, we can return with the appropriate sections populated.

    [{
      /** section */
      styles,
      slides: [{
        /** slide */
        url (pkey),
        html,
        styles
      }, ...]
    }, ...]

The storage model in the DB however is different. We're using PG (easiest on Heroku) so the following denotes the columns for each row in the DB:

    id(serial)
    url(str)
    section(int)
    slide(int)
    html(str)
    styles(str)
    section_styles(str)
    created(date)
    updated(date)

The constraints on this storage are:

    unique(url)
    unique(section, slide)

Notes on the styles objects:

- The styles parameter is stored as a JSON str in the database. It is a JSON object
- Styling for the slide or section is done with `styles.root`. All other children of the styles object are style objects for the stored html and can be referenced by their `styles.html_tag_name.root`.
- As alluded to earlier, the styles object may be hierarchical in nature
- The section_styles (should there exist any) are copied over multiple rows. This is to save storage space on Heroku.
