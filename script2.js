async function loadData(){
    let response = await axios.get('./datasets/listing-of-registered-therapeutic-products.csv');
    let json = await csv().fromString(response.data);
    return json
}

async function displayData(){
    let data = await loadData();
    console.log(data)
    let tbody = document.querySelector('thead')
    for (let individual of data){
        let tr = document.createElement('tr')
        tbody.appendChild(tr)
        let td1 = document.createElement('td')
        td1.innerHTML = individual.product_name
        let td2 = document.createElement('td')
        td2.innerHTML = individual.active_ingredients
        let td3 = document.createElement('td')
        td3.innerHTML = individual.forensic_classification
        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
    }
}

displayData()