let map = L.map('map')
map.setView([1.3521, 103.8198], 11)

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    minZoom: 11,
    maxZoom: 18,
    id: 'mapbox/streets-v11',  // style of the tiles
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw' //demo access token
}).addTo(map);

map.setMaxBounds(L.latLngBounds([1.485448, 104.084908], [1.188641, 103.582865]))

let markerClusterLayer = L.markerClusterGroup()
markerClusterLayer.addTo(map)

let myIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    shadowUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png',
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
});

async function read() {
    let response = await axios.get('./datasets/retail-pharmacy-locations-geojson.geojson')
    console.log(response.data.features)
    let layer = L.geoJson(response.data, {
        pointToLayer: function(geoJsonPoint, latlng) {
            return L.marker(latlng, {
                icon: myIcon
            });
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.Description)
        }
    }).addTo(markerClusterLayer)
}

read()

map.locate({setView: true, maxZoom: 16});

function onLocationFound(e) {
    var radius = e.accuracy / 2;

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, 1000).addTo(map);
}

map.on('locationfound', onLocationFound);

async function loadData() {
    let response = await axios.get('./datasets/listing-of-registered-therapeutic-products.csv');
    let json = await csv().fromString(response.data);
    return json
}

let search = document.querySelector('#search')
search.addEventListener('keydown', async function (event) {
    let data = await loadData()

    if (event.key == 'Enter') {

        document.querySelector('table').classList.remove('d-none')

        let allRows = document.querySelectorAll('tr')
        for (let row of allRows) {
            row.style.display = ''
        }

        let productNotFound = true

        let productNameTd = document.querySelectorAll('.product-name');
        let apiTd = document.querySelectorAll('.api');
        for (let i = 0; i < productNameTd.length; i++) {
            if (productNameTd[i].innerHTML.toLowerCase().includes(search.value.toLowerCase()) || apiTd[i].innerHTML.toLowerCase().includes(search.value.toLowerCase())) {
                console.log(productNameTd[i].innerHTML)
                productNotFound = false
            } else {
                document.querySelector('#row-' + CSS.escape(i)).style.display = 'none'
            }
        }

        if (productNotFound) {
            console.log('Product not found')
        }
    }
})

async function displayData() {
    let data = await loadData();
    console.log(data)
    let tbody = document.querySelector('tbody')
    tbody.style.display = ''

    for (let i = 0; i < data.length; i++) {
        let tr = document.createElement('tr')
        tr.id = `row-${i}`
        tbody.appendChild(tr)

        let td1 = document.createElement('td')
        td1.innerHTML = data[i].product_name
        td1.className = 'product-name'

        let td2 = document.createElement('td')
        let split = data[i].active_ingredients.split('&&')
        if (Array.isArray(split)) {
            let ul = document.createElement('ul')
            td2.appendChild(ul)
            for (let i of split) {
                i = i.toLowerCase();
                let li = document.createElement('li')
                ul.appendChild(li)
                li.innerHTML = `<span> ${i} </span>`
            }
        }
        td2.classList.add('text-capitalize', 'api')

        let td3 = document.createElement('td')
        td3.innerHTML = data[i].forensic_classification
        td3.className = 'classification'

        let td4 = document.createElement('td')
        td4.innerHTML = data[i].atc_code
        td4.className = 'atc-code'

        let td5 = document.createElement('td')
        td5.innerHTML = data[i].dosage_form
        td5.className = 'dosage-form'

        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td5)
        tr.appendChild(td3)
        tr.appendChild(td4)
    }
}

displayData()