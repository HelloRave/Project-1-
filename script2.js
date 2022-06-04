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
        
        let allRows = document.querySelectorAll('tr')
        for (let row of allRows){
            row.style.display = ''
        }

        let productNotFound = true

        let td = document.querySelectorAll('.product-name')
        for (let i = 0; i < td.length; i++){
            if (td[i].innerHTML.toLowerCase().includes(search.value.toLowerCase())){
                console.log(td[i].innerHTML)
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
        if (Array.isArray(split)){
            for (let i of split){
                i = i.toLowerCase();
                td2.innerHTML += i + '<br>'
            }
        }
        td2.classList.add('text-capitalize','api')
        
        let td3 = document.createElement('td')
        td3.innerHTML = data[i].forensic_classification
        td3.className = 'classification'
        
        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
    }
}

displayData()