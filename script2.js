async function loadData() {
    let response = await axios.get('./datasets/listing-of-registered-therapeutic-products.csv');
    let json = await csv().fromString(response.data);
    return json
}

let search = document.querySelector('#search')
search.addEventListener('keydown', async function (event) {
    // console.log(search.value)
    let data = await loadData()
    // let tbody = document.querySelector('tbody')
    if (event.key == 'Enter') {
        let productNotFound = true
        for (let individual of data) {
            if (individual.product_name.toLowerCase().includes(search.value.toLowerCase())) {
                console.log(individual.product_name)
                productNotFound = false
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
    for (let individual of data) {
        let tr = document.createElement('tr')
        tbody.appendChild(tr)
        let td1 = document.createElement('td')
        td1.innerHTML = individual.product_name
        td1.className = 'col-2'
        let td2 = document.createElement('td')
        let split = individual.active_ingredients.split('&&')
        if (Array.isArray(split)){
            for (let i of split){
                i = i.toLowerCase();
                td2.innerHTML += i + '<br>'
            }
        }
        td2.classList.add('text-capitalize','col-9')
        let td3 = document.createElement('td')
        td3.innerHTML = individual.forensic_classification
        td3.className = 'col-1'
        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
    }
}

displayData()