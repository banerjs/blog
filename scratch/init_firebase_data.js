var countries = require('./views/map_view/countries.json');
var data = {};

function urlize(str) {
	return str.replace(/[^\w\s]/g, '').replace(/\s/g, '_').toLowerCase();
}

function createData(datum) {
	var url = urlize(datum.properties.NAME || datum.properties.NAME_SORT);
	if (!!data.url) {
		throw "Error: Duplicate";
	}

	if (!url) {
		throw "Error: Empty URL for " + datum.properties.NAME;
	}

	data[url] = {
		name: datum.properties.NAME,
		abbr: datum.properties.ISO_A3,
		properties: {
	        "ScaleRank": datum.properties.ScaleRank,
	        "LabelRank": datum.properties.LabelRank,
	        "FeatureCla": datum.properties.FeatureCla,
	        "SOVEREIGNT": datum.properties.SOVEREIGNT,
	        "SOV_A3": datum.properties.SOV_A3,
	        "ADM0_DIF": datum.properties.ADM0_DIF,
	        "LEVEL": datum.properties.LEVEL,
	        "TYPE": datum.properties.TYPE,
	        "ADMIN": datum.properties.ADMIN,
	        "ADM0_A3": datum.properties.ADM0_A3,
	        "GEOU_DIF": datum.properties.GEOU_DIF,
	        "GEOUNIT": datum.properties.GEOUNIT,
	        "GU_A3": datum.properties.GU_A3,
	        "SU_DIF": datum.properties.SU_DIF,
	        "SUBUNIT": datum.properties.SUBUNIT,
	        "SU_A3": datum.properties.SU_A3,
	        "NAME": datum.properties.NAME,
	        "ABBREV": datum.properties.ABBREV,
	        "POSTAL": datum.properties.POSTAL,
	        "NAME_FORMA": datum.properties.NAME_FORMA,
	        "TERR_": datum.properties.TERR_,
	        "NAME_SORT": datum.properties.NAME_SORT,
	        "MAP_COLOR": datum.properties.MAP_COLOR,
	        "POP_EST": datum.properties.POP_EST,
	        "GDP_MD_EST": datum.properties.GDP_MD_EST,
	        "FIPS_10_": datum.properties.FIPS_10_,
	        "ISO_A2": datum.properties.ISO_A2,
	        "ISO_A3": datum.properties.ISO_A3,
	        "ISO_N3": datum.properties.ISO_N3
		},
		geometry: datum.geometry,
		has_been_visited: false,
		posts: []
	};
}

countries.features.map(createData);

countries = data;
data = { countries: countries };
data.articles = {};

fs = require('fs');
fs.writeFile('data.json', JSON.stringify(data));
