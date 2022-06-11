// Pre loader
// window.addEventListener('load', function () {
//     document.querySelector('#loader').className = 'd-none'
// })

// Create Map
function createMap() {
    // Set up map view and bounds 
    let map = L.map('map')
    map.setView([1.3521, 103.8198], 12)
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

    map.locate({ setView: false, maxZoom: 18 })

    function onLocationFound(e) {
        var radius = e.accuracy;

        L.marker(e.latlng).addTo(map)
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
let rxFontawesomeIcon = L.divIcon({
    html: '<i class="fa-solid fa-prescription"></i>',
    iconSize: null,
    className: 'div-icon'
})
// - to learn how to style 

let MarkerIcon = L.Icon.extend({
    options: {
        shadowUrl: '../images/markers/marker-shadow.png'
    }
})

let hospitalMarker = new MarkerIcon({ iconUrl: '../images/markers/marker-icon-red.png' })
let pharmacyMarker = new MarkerIcon({ iconUrl: '../images/markers/marker-icon-gold.png' })
let gslMarker = new MarkerIcon({ iconUrl: '../images/markers/marker-icon-blue.png' })

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
function displayGeojson(responseData, markerIcon, hospital = null) {
    let layer = L.geoJson(responseData, {
        filter: function (feature) {
            if (!hospital) {
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
            console.log(allTd)
            layer.bindPopup(`
            Pharmacy Name: ${allTd[6].innerHTML}
            Address: ${allTd[4].innerHTML} SINGAPORE ${allTd[0].innerHTML}`) //To fix accordian and insert image 
        }
    })

    return layer
}

// Nest displayGeojson under a layer when page loads
let map = createMap()
let initialDisplay = null;
let removeGsl = null;
let removePmed = null;
let removePom = null;
let addPmed = null;
let addPom = null;

// Create/Remove layer function
function createLayer(layer) {
    let create = function () {
        if (!map.hasLayer(layer)) {
            map.addLayer(layer)
        }
    }
    return create
}

function removeLayer(layer) {
    let remove = function () {
        if (map.hasLayer(layer)) {
            map.removeLayer(layer)
        }
    }
    return remove
}

//Custom marker cluster icon create function
function createMarkerClusterGroup(className) {
    let markerClusterGroup = L.markerClusterGroup({
        iconCreateFunction: function (cluster) {
            if(cluster.getChildCount() < 15){
                return L.divIcon({ html: `<div class='${className}-small-p'>${cluster.getChildCount()}</div>`, className: className + '-small', iconSize: L.point(35, 35)})
            } else{
                return L.divIcon({ html: `<div class='${className}-medium-p'>${cluster.getChildCount()}</div>`, className: className + '-medium', iconSize: L.point(45, 45)})
            }
        }
    });
    return markerClusterGroup;
}


// Display map when DOMContentLoaded
window.addEventListener('DOMContentLoaded', async function () {
    let response = await axios.get('./datasets/retail-pharmacy-locations-geojson.geojson')
    console.log(response.data.features)

    // Add all four layers to map 
    let hospitalLayerGroup = L.layerGroup().addTo(map)
    let gslMarkerClusterLayer = createMarkerClusterGroup('gslMarkerClusterIcon').addTo(map)
    let pmedMarkerClusterLayer = createMarkerClusterGroup('pmedMarkerClusterIcon').addTo(map)
    let pomMarkerClusterLayer = createMarkerClusterGroup('pomMarkerClusterIcon').addTo(map)

    // Add geoJson to respective cluster group 
    let hospital = displayGeojson(response.data, hospitalMarker, 'hospital').addTo(hospitalLayerGroup)
    let gsl = displayGeojson(response.data, gslMarker).addTo(gslMarkerClusterLayer)
    let pmed = displayGeojson(response.data, pharmacyMarker).addTo(pmedMarkerClusterLayer)
    let pom = displayGeojson(response.data, hospitalMarker).addTo(pomMarkerClusterLayer)

    // Hospital layer add to overlay 
    L.control.layers({}, {
        'Hospital': hospitalLayerGroup,
    }).addTo(map)

    // Function to render map to initial display 
    initialDisplay = function () {
        if (map.hasLayer(pmedMarkerClusterLayer) || map.hasLayer(pomMarkerClusterLayer)) {
            map.removeLayer(pmedMarkerClusterLayer);
            map.removeLayer(pomMarkerClusterLayer);
        }
        if (!map.hasLayer(gslMarkerClusterLayer)) {
            map.addLayer(gslMarkerClusterLayer)
        }
        if (!map.hasLayer(hospitalLayerGroup)) {
            map.addLayer(hospitalLayerGroup)
        }
    }

    // Function to add/remove relevant layers 
    addPmed = createLayer(pmedMarkerClusterLayer);
    addPom = createLayer(pomMarkerClusterLayer);
    removeGsl = removeLayer(gslMarkerClusterLayer);
    removePmed = removeLayer(pmedMarkerClusterLayer);
    removePom = removeLayer(pomMarkerClusterLayer)

    // Set map as initial display to prevent all four layers from displaying together 
    initialDisplay()
})

