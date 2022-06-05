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