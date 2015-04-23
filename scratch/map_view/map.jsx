// THIS SECTION IS TERRIBLE CODING
var CHANGE_EVENT = 'change';
var GEOJSON_UPDATE = 'geojson-update';

var MapStore = objectAssign({}, EventEmitter.prototype);
MapStore['_countriesGeoJSON'] = {
    "type": "FeatureCollection",
    "features": []
};

MapStore['getCountries'] = function() {
    return MapStore._countriesGeoJSON;
};

MapStore['emitChange'] = function() {
    this.emit(CHANGE_EVENT);
};

MapStore['addChangeListener'] = function(callback) {
    this.on(CHANGE_EVENT, callback);
};

MapStore['removeChangeListener'] = function(callback) {
    this.off(CHANGE_EVENT, callback);
},

MapStore['handleDispatch'] = function(payload) {
    var action = payload.action;

    switch(action.actionType) {
        case GEOJSON_UPDATE:
            MapStore._countriesGeoJSON = action.data;
            MapStore.emitChange();
            break;
        // Add in other case statements
    }

    // Ensure that the promises of the Dispatcher properly resolve
    return true;
}

Dispatcher.register(MapStore.handleDispatch);

// Fix coding above this line of text

// This should be in its own set of classes
var MapActions = {
    notifyServerUpdate: function(data) {
        Dispatcher.handleXHRData({
            actionType: GEOJSON_UPDATE,
            data: data
        });
    }
}

// This is the actual map
var MapCanvas = React.createClass({
    initializeMap: function() {
        // In the case of SSR, we do not want the map to be rendered (I think).
        // In the future change this so that it is map agnostic as well
        if (!google) {
            return;
        }

        var mapOptions = {
            center: { lat: 20, lng: 0 },
            scrollwheel: false,
            zoom: 2,
            maxZoom: 7,
            minZoom: 2,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            styles: styles
        }

        var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        // Setup parameters for the data layer
        map.data.setStyle(function(feature) {
            var color = "#7e8aa2";
            var strokeWeight = 1;
            var strokeColor = "#000000";
            if (!!feature.getProperty('clicked')) {
                color = "#ff9800";
                strokeWeight = 3;
                strokeColor = "#ffffff";
            }
            return {
                strokeColor: strokeColor,
                strokeWeight: strokeWeight,
                fillColor: color,
                fillOpacity: 1
            };
        });

        map.data.addListener('mouseover', function(event) {
            if (!!event.feature.getProperty('has_posts')) {
                map.data.revertStyle();
                map.data.overrideStyle(event.feature, { fillColor: "#263248" });
            }
        });

        map.data.addListener('mouseout', function(event) {
            map.data.revertStyle();
        });

        map.data.addListener('click', function(event) {
            if (!!event.feature.getProperty('has_posts')) {
                event.feature.setProperty('clicked', !event.feature.getProperty('clicked'));
            }
        });

        return map;
    },

    refreshMapData: function() {
        this.state.map.data.addGeoJson(this.state.countries);
    },

    handleXHRData: function() {
        this.setState({
            countries: MapStore.getCountries(),
            cssClass: {
                "map-container": true,
                "hidden": false
            }
        });
    },

    getInitialState: function() {
        var firebase = new Firebase('https://incandescent-fire-5437.firebaseio.com/countries');
        firebase.once("value", function(response) {
            var countries = response.val();
            var geojson = createCountriesGeoJSON(countries);
            MapActions.notifyServerUpdate(geojson);
        }, function(error) {
            console.error(error)
        }, this);

        // Send in a default set of values while firebase is dealing with
        // fetching the data
        return {
            countries: MapStore.getCountries(),
            map: null,
            cssClass: {
                "map-container": true,
                "hidden": true
            }
        };
    },

    componentDidMount: function() {
        MapStore.addChangeListener(this.handleXHRData);
        this.setState({ map: this.initializeMap() });
    },

    componentWillUnmount: function() {
        MapStore.removeChangeListener(this.handleXHRData);
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        // Update the data for Google maps to handle the update (not React!)
        setTimeout(this.refreshMapData, 0);

        // // Update the CSS class associations
        // this.getDOMNode().className = classNames(this.state.cssClass);

        // All updates to this node are either manually handled or by the maps
        // provider. Do not allow React to update the node
        return this.state.countries !== nextState.countries;
    },

    render: function() {
        return (
            <div className={ classNames(this.state.cssClass) }>
                <div id="map-canvas" className="map-container"></div>
            </div>
        );
    }
});

var MapLoader = React.createClass({
    handleXHRData: function() {
        this.setState({
            cssClass: {
                "map-container": true,
                "map-loader": true,
                "hidden": true
            }
        });
    },

    getInitialState: function() {
        return {
            cssClass: {
                "map-container": true,
                "map-loader": true,
                "hidden": false
            }
        }
    },

    componentDidMount: function() {
        MapStore.addChangeListener(this.handleXHRData);
    },

    componentWillUnmount: function() {
        MapStore.removeChangeListener(this.handleXHRData);
    },

    render: function() {
        return (
            <div className={ classNames(this.state.cssClass) }>
            </div>
        );
    }
});

var Map = React.createClass({
	render: function() {
		return (
			<section className="map-container" data-start="opacity: 0.75;" data-top="opacity: 1;" data-bottom="opacity: 1;" data-top-bottom="opacity: 0.1;">
                <MapCanvas ref="canvas" />
			</section>
		);
	}
});

// This is a style a-la Snazzy Maps
var styles = [{"featureType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","stylers":[{"visibility":"on"},{"lightness": 100}]},{"featureType":"landscape","stylers":[{"visibility": "on"},{"lightness":-100},{"saturation": 0}]}];

// This is a helper function to convert Firebase data to GeoJSON
function createCountriesGeoJSON(data) {
    var json = { "type": "FeatureCollection", "features": [] };
    Object.keys(data).map(function(country_url, idx) {
        var country = data[country_url];
        if (!!country.has_been_visited) {
            json.features.push({
                type: "Feature",
                id: idx,
                name: country.name,
                abbr: country.abbr,
                has_posts: (!!country.posts && country.posts.length > 0),
                geometry: country.geometry
            });
        }
    });
    return json
}
