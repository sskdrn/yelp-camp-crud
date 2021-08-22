
mapboxgl.accessToken = mapToken;
let points=campground.geometry.coordinates;
var map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center:points, // starting position [lng, lat]
zoom: 8 // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());
var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
    `<h5>${campground.title}</h5><p>${campground.location}</p>`
    );
new mapboxgl.Marker()
    .setLngLat(points)
    .setPopup(popup)
    .addTo(map);