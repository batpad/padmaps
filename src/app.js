const mapboxgl = require('mapbox-gl');
const _ = require('lodash');
const fetchClipsInBBox = require('./utils/fetch-clips-in-bbox');
const bboxPolygon = require('turf-bbox-polygon');
const delay = require('delay');
const pMap = require('p-map');
const uuid = require('uuid/v4');

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FuamF5YiIsImEiOiJjaWcwcHc1dGIwZXBudHJrd2t5YjI3Z3VyIn0.j_6dWw8HvH5RtZrMBqbP1Q';

const padMap = window.padMap = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v8', //stylesheet location
    center: [72.828002, 18.963406],
    hash: true,
    zoom: 16 // starting zoom
});

padMap.on('load', () => {
    loadVideosInBBox()
});

// padMap.on('moveend', () => {
//     _.debounce(loadVideosInBBox, 3000)();
// });

function loadVideosInBBox() {
    const bbox = padMap.getBounds();
    fetchClipsInBBox(bbox)
        .then(videos => {
            return pMap(videos, playVideo, {concurrency: 1});
        });
}

function playVideo(video) {
    const sourceId = uuid();
    padMap.addSource(sourceId, {
        type: 'video',
        urls: [
            getVideoFromId(video.clips[0].id)
        ],
        coordinates: getCoords(video.place)
    });
    padMap.addLayer({
        'type': 'raster',
        'id': `layer-${sourceId}`,
        'source': sourceId
    });
    const videoElem = padMap.getSource(sourceId).getVideo();
    return delay(300).then(() => {
        const videoElem = padMap.getSource(sourceId).getVideo();
        videoElem.currentTime = video.clips[0].in;
    })
}

function getVideoFromId(id) {
    id = id.split('/')[0];
    return `https://28.v1.pad.ma/${id}/96p1.webm`;
}

function getCoords(place) {
    const polygon = bboxPolygon([
        place.east,
        place.south,
        place.west,
        place.north
    ]);
    const coords = polygon.geometry.coordinates;
    return [
        coords[0][2],
        coords[0][3],
        coords[0][0],
        coords[0][1]
    ];
}