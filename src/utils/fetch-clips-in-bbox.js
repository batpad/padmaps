const callAPI = require('./call-api');

module.exports = fetchClipsInBBox;

function fetchClipsInBBox(bounds) {
	return fetchPlaces(bounds)
		.then(places => {
			const promises = places.map(place => fetchClipsAtPlace(place));
			return Promise.all(promises);
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
		"range": [0, 4],
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
				"value": "CDD",
				"operator": "=="
			}],
			"operator": "&"
		},
		"range": [0, 3],
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