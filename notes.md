# Resources

- Google Maps styling: [SnazzyMaps](https://snazzymaps.com/)
- Blog styles: [CMarsh](http://www.crmarsh.com/script/), [Justin](http://www.justinyan.com/posts/2015/self-esteem/)
- Bootstrap Themes: [Bootswatch](https://bootswatch.com/)
- Online Shapefile Viewer: [Mapshaper](http://www.mapshaper.org/)
- Countries Data: [Data OKFN](http://data.okfn.org/data/datasets/geo-boundaries-world-110m), [Google Groups](https://groups.google.com/forum/#!topic/d3-js/cTVo0Uci5x4), **[Stack Overflow](http://stackoverflow.com/questions/9542834/geojson-world-database)**
- Not using this yet... but perhaps I should? [fullPage](https://github.com/alvarotrigo/fullPage.js)

# Todo

- Create page design
  - ~~Travelogue Mock~~
  - Skrollr-ize the mocks. Easy addition of skrollr pages
  - Create mocks for general blog
  - Create Navigation
- Create isomorphic webapp
  - Create modular models. Includes configuring data source(s)
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
