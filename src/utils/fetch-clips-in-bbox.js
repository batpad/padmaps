const callAPI = require('./call-api');
const pMap = require('p-map');

module.exports = fetchClipsInBBox;

function fetchClipsInBBox(bounds) {
	return fetchPlaces(bounds)
		.then(places => {
			return pMap(places, fetchClipsAtPlace);
		});
}

function fetchPlaces(bounds) {
	const lat = [bounds._sw.lat, bounds._ne.lat];
	const lng = [bounds._sw.lng, bounds._ne.lng];
	const query = {
		"itemsQuery": {
			"operator": "&",
			"conditions": []
		},
		"keys": ["id", "name", "alternativeNames", "geoname", "countryCode", "type", "lat", "lng", "south", "west", "north", "east", "area"],
		"query": {
			"conditions": [{
				"key": "lat",
				"value": lat,
				"operator": "="
			}, {
				"key": "lng",
				"value": lng,
				"operator": "="
			}],
			"operator": "&"
		},
		"range": [0, 20],
		"sort": [{
			"key": "area",
			"operator": "+"
		}]
	};
	return callAPI('findPlaces', query)
		.then(data => data.items);
}

function fetchClipsAtPlace(place) {
	const query = {
		"keys": ["title", "annotations", "id", "in", "out", "videoRatio"],
		"query": {
			"conditions": [{
				"key": "place",
				"value": place.id,
				"operator": "=="
			}],
			"operator": "&"
		},
		"range": [0, 1],
		"sort": [{
			"key": "title",
			"operator": "+"
		}],
		"itemsQuery": {
			"operator": "&",
			"conditions": []
		}
	};
	return callAPI('findClips', query)
		.then(data => {
			return {
				place: place,
				clips: data.items
			}
		});
}