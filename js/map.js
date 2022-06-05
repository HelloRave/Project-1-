// Create Map
function createMap() {
    let map = L.map('map')
    map.setView([1.3521, 103.8198], 11)
    map.setMaxBounds(L.latLngBounds([1.485448, 104.084908], [1.188641, 103.582865]))
    
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
        minZoom: 11,
        maxZoom: 18,
        id: 'mapbox/streets-v11',  // style of the tiles
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw' //demo access token
    }).addTo(map);

    map.locate({ setView: true, maxZoom: 16 });

    function onLocationFound(e) {
        var radius = e.accuracy / 2;

        L.marker(e.latlng).addTo(map)
            .bindPopup("You are within " + radius + " meters from this point").openPopup();

        L.circle(e.latlng, 1000).addTo(map);
    }

    map.on('locationfound', onLocationFound);

    return map

}

// Customised Icon
let myIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    shadowUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png',
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
});

// Display map when DOMContentLoaded
window.addEventListener('DOMContentLoaded', async function(){
    let response = await axios.get('./datasets/retail-pharmacy-locations-geojson.geojson')
    console.log(response.data.features)

    let map = createMap();

    let markerClusterLayer = L.markerClusterGroup()
    markerClusterLayer.addTo(map)

    let layer = L.geoJson(response.data, {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.marker(latlng, {
                icon: myIcon
            });
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.Description)
        }
    }).addTo(markerClusterLayer)
})