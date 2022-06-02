let map = L.map('map').setView([1.3521, 103.8198], 13)

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',  // style of the tiles
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw' //demo access token
}).addTo(map);

async function read(){
    let response = await axios.get('./datasets/retail-pharmacy-locations-geojson.geojson')
    console.log(response)
    let layer = L.geoJson(response.data, {
        onEachFeature: function(feature, layer){
            layer.bindPopup(feature.properties.Description)
        }
    }).addTo(map)
}

read()

async function loadData(){
    let response = await axios.get('./datasets/listing-of-registered-therapeutic-products.csv');
    let json = await csv().fromString(response.data);
    console.log(json)
}

loadData()
