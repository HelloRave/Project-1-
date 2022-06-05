// Load and convert CSV to JSON 
async function loadData() {
    let response = await axios.get('./datasets/listing-of-registered-therapeutic-products.csv');
    let json = await csv().fromString(response.data);
    return json
}

// Filtering function
async function filterData(k, v) {
    let data = await loadData();

    // return array of objects with relevant keys and values
    let filteredArr = data.filter((object) => {
        return typeof object[k] == 'string' && object[k].toLowerCase().includes(v)
    })

    return filteredArr
}

// Create table data (td) function
function createTableData(arr, i, k){
    let td = document.createElement('td')
    td.innerHTML = arr[i][k]
    td.className = k

    return td 
}

// Display search results when 'Enter' key pressed 
let search = document.querySelector('#search')
search.addEventListener('keydown', async function (event) {

    if (event.key == 'Enter') {

        // To filter data to match search value with product name or active ingredient
        let searchValue = search.value.toLowerCase()

        let filteredArr_1 = await filterData('product_name', searchValue)
        let filteredArr_2 = await filterData('active_ingredients', searchValue)
        let combinedFilteredArr = filteredArr_1.concat(filteredArr_2)

        // If no match, display message
        if (combinedFilteredArr.length == 0){
            console.log('Product not found')
        }

        // To display filteredArr on table 
        document.querySelector('table').classList.remove('d-none')
        let tbody = document.querySelector('tbody')
        tbody.innerHTML = ""

        for (let i = 0; i < combinedFilteredArr.length; i++) {
            let tr = document.createElement('tr')
            tr.id = `row-${i}`
            tbody.appendChild(tr)

            let td1 = createTableData(combinedFilteredArr, i, 'product_name')

            let td2 = document.createElement('td')
            let split = combinedFilteredArr[i].active_ingredients.split('&&')
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

            let td3 = createTableData(combinedFilteredArr, i, 'dosage_form') 
            let td4 = createTableData(combinedFilteredArr, i, 'forensic_classification') 
            let td5 = createTableData(combinedFilteredArr, i, 'atc_code') 


            tr.appendChild(td1)
            tr.appendChild(td2)
            tr.appendChild(td3)
            tr.appendChild(td4)
            tr.appendChild(td5)
        }
    }
}) 
