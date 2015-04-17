var Map = React.createClass({
	initialize_map: function() {
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

        // Add in countries
        map.data.loadGeoJson('map_view/countries_test.json');

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
            map.data.revertStyle();
            map.data.overrideStyle(event.feature, { fillColor: "#263248" });
        });

        map.data.addListener('mouseout', function(event) {
            map.data.revertStyle();
        });

        map.data.addListener('click', function(event) {
            event.feature.setProperty('clicked', !event.feature.getProperty('clicked'));
        });
	},

	componentDidMount: function() {
		this.initialize_map();
	},

	render: function() {
		return (
			<section id="map" data-start="opacity: 0.75;" data-top="opacity: 1;" data-bottom="opacity: 1;" data-top-bottom="opacity: 0.1;">
				<div id="map-canvas"></div>
			</section>
		);
	}
});

// This is a style a-la Snazzy Maps
var styles = [{"featureType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","stylers":[{"visibility":"on"},{"lightness": 100}]},{"featureType":"landscape","stylers":[{"visibility": "on"},{"lightness":-100},{"saturation": 0}]}];
