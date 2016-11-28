# To start

- Start from Windows: `docker-machine.exe env --shell powershell default | Invoke-Expression`
- Start a new web container with the following command: `docker run --name blog -i -t -v /c/Users/Siddhartha/Documents/Code/blog/:/usr/src/ -w /usr/src/ -p 8000:8000 --rm node:6 bash`
  - If this is the first time running the container, then make sure to export .env in the current directory. It sets up the required environment variables locally
- Start a new mongo container `docker run --name blog-mongo -d -v /tmp/blog/:/data/db -P mongo`
  - Note the container uses the folder /tmp in the virtual machine as a data directory. This is not accessible from windows
  - Use `docker network inspect bridge` to figure out the IP address of the new container
  - Run `export DATABASE_URL="<mongo url of database>"` in the node container shell running the server (or change the `.env` file in this directory)
- Run the npm installer to get all project dependencies: `./install_deps_globally.sh package.json`
- Clean and start gulp in watch mode: `npm run clean; npm run gulp &`
- Start the server in debug: `npm run debug`
- Long term, add the following lines to `.bashrc`:

```
if [ -f /usr/src/.env ]; then
  . /usr/src/.env
fi
```

# Resources

- Google Maps styling: [SnazzyMaps](https://snazzymaps.com/)
- Blog styles:
  - [CMarsh](http://www.crmarsh.com/script/)
  - [Justin](http://www.justinyan.com/posts/2015/self-esteem/)
  - [Paravel Founder Sites](http://paravelinc.com/about.php)
    - [Trent Walton](http://trentwalton.com/)
    - [Dave Rupert](http://daverupert.com/)
- Online Shapefile Viewer: [Mapshaper](http://www.mapshaper.org/)
- Countries Data: [Data OKFN](http://data.okfn.org/data/datasets/geo-boundaries-world-110m), [Google Groups](https://groups.google.com/forum/#!topic/d3-js/cTVo0Uci5x4), **[Stack Overflow](http://stackoverflow.com/questions/9542834/geojson-world-database)**
- [HTML Semantic Tags](http://html5doctor.com/downloads/h5d-sectioning-flowchart.pdf)
- [Parallax Scrolling](https://ihatetomatoes.net/how-to-create-a-parallax-scrolling-website/)
- GIF Creation - [Spiffygif](http://spiffygif.com/)
- Free Stock Photos - [Unsplash](https://unsplash.com/)
- Glyphs from [WebHostingHub](http://www.webhostinghub.com/glyphs/)

# Features

- Animations
- Create Unit Tests
- Add in Timeouts to the fetch code on the server side. While Promise.race is a viable option, there already exists express middleware capable of doing this
- Improve Performance
  - Use a proper cache for posts loaded from disk instead of preloading all posts to memory
  - Use `bluebird`, or something equally performant, for promises
- Help popup for keyboard shortcuts
- Transition to node:6-alpine as the base image for the container
- Templating of the HTML stored in the posts
  - Design a syntax set that can be used to add automatic metadata to post HTML
  - Use automated markdown parsing for the posts during the gulp build process
- Migrate to using Mongoose for schema validation
- Have a less complicated dependency tree
- Create less complicated codebase

If I want to keep the same features in the Admin pages:

- Structure editing similar to Trello
- Better routing in the Admin section, and maybe even the Blog section
  - Routing using constants in the Actions is distressing
  - Django style URLs and URL processing
  - 404 page when browsing client side
  - Graceful handling of trailing slashes
- Indicate and implement presence of an index file within a section

If I want to simplify the Admin pages to simply handle the metadata, and leave the editing of the posts to git (leaning towards this):

- Revamp admin and blog URL structuring
  - Infer path and metadata from the file system

# Todo

- Move to node 6 and OpenShift
- Create a way to maintain the data source
  - Allow editing of sections
    - Create XHR endpoints for the edits
    - Hook up the XHR endpoints to the data sources
  - Allow editing of posts
    - Create the XHR endpoints for the edits
    - Hook up the endpoints to the data sources

# Data Schema

sections

```
name text not null              # This is the display name. Capitalize!
foldername text not null unique # Foldername in the folder src/posts
url text not null unique        # URL to the index of the section
priority bigint not null        # Display priority. Home is always 1
slides text[]                   # Array of URLs for the slides in a section
index_filename text             # TODO. Not implemented yet
```

posts

```
url text not null unique        # URL of the post
section text not null           # Needs to match the foldername of the section
slide bigint not null           # Priority for display
filename text not null unique   # File path relative to src/posts
title text                      # <title> element
css text                        # File path relative to src/css
created_date timestamp with time zone not null default now()
updated_date timestamp with time zone not null default now()
```

Indices needed:

- `section.priority`
- `section.url`
- `posts.section + posts.slide` -- unique
- `posts.url`
