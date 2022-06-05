// Create Map
function createMap() {
    // Set up map view and bounds 
    let map = L.map('map')
    map.setView([1.3521, 103.8198], 11)
    map.setMaxBounds(L.latLngBounds([1.485448, 104.084908], [1.188641, 103.582865]))
    
    // Tile Layer
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
        minZoom: 11,
        maxZoom: 18,
        id: 'mapbox/streets-v11',  // style of the tiles
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw' //demo access token
    }).addTo(map);

    // Current location on map
    // setInterval(function (){
    //     map.locate({setView: true, maxZoom: 18}, 5000)
    // }) - super laggy 
    
    map.locate({setView: true, maxZoom: 18}) 

    function onLocationFound(e) {
        var radius = e.accuracy / 2;

        L.marker(e.latlng, {
            icon: gslMarker
        }).addTo(map)
            .bindPopup("You are within " + radius + " meters from this point").openPopup();

        L.circle(e.latlng, 1000).addTo(map);
    }

    map.on('locationfound', onLocationFound);

    function onLocationError(e) {
        alert(e.message);
    }
    
    map.on('locationerror', onLocationError);
    
    return map

}

// Customised Icon
let MarkerIcon = L.Icon.extend({
    options: {
        shadowUrl: '../images/markers/marker-shadow.png'
    }
})

let hospitalMarker = new MarkerIcon({iconUrl: '../images/markers/marker-icon-red.png'})
let pharmacyMarker = new MarkerIcon({iconUrl: '../images/markers/marker-icon-gold.png'})
let gslMarker = new MarkerIcon({iconUrl: '../images/markers/marker-icon-blue.png'})

// let myIcon = L.icon({
//     iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
//     shadowUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png',
//     iconSize: [38, 95],
//     iconAnchor: [22, 94],
//     popupAnchor: [-3, -76],
//     shadowSize: [68, 95],
//     shadowAnchor: [22, 94]
// });

// Display GeoJSON function 
function displayGeojson(responseData, markerIcon, hospital = null){
    let layer = L.geoJson(responseData, {
        filter: function (feature){
            if (!hospital){
                return !feature.properties.Description.toLowerCase().includes("hospital")
            } else {
                return feature.properties.Description.toLowerCase().includes(hospital) //To improve: some address with 'hospital' but not hospitals
            }
        },
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: markerIcon
            });
        },
        onEachFeature: function (feature, layer) {
            let div = document.createElement('div');
            div.innerHTML = feature.properties.Description;
            let allTd = div.querySelectorAll('td')
            layer.bindPopup(`
            <div>
                <p> Address: ${allTd[4].innerHTML} SINGAPORE ${allTd[0].innerHTML} </p>
                <p> Pharmacy Name: ${allTd[6].innerHTML} </p>
            </div>`)
        }
    })

    return layer 
}

// Nest displayGeojson under a layer when page loads
let map = createMap()
let initialDisplay = null; 

// Display map when DOMContentLoaded
window.addEventListener('DOMContentLoaded', async function(){
    let response = await axios.get('./datasets/retail-pharmacy-locations-geojson.geojson')
    console.log(response.data.features)

    // To find way to put marker clustering with control layers
    let initialMarkerClusterLayer = L.markerClusterGroup()
    initialMarkerClusterLayer.addTo(map)
    initialDisplay = initialMarkerClusterLayer

    let hospitalLayer = displayGeojson(response.data, hospitalMarker, 'hospital').addTo(initialMarkerClusterLayer)
    let othersLayer = displayGeojson(response.data, pharmacyMarker).addTo(initialMarkerClusterLayer)
    
    // initialDisplay = L.control.layers({},{
    //     'Hospital': layer1,
    //     'Others': layer2
    // }).addTo(map)
})