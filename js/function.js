// Load and convert CSV to JSON 
async function loadData() {
    let response = await axios.get('./datasets/listing-of-registered-therapeutic-products.csv');
    let json = await csv().fromString(response.data);
    return json
}

// Filter search function
async function filterSearch(k, v) {
    let data = await loadData();

    // return array of objects with relevant keys and values
    let filteredArr = data.filter((object) => {
        return typeof object[k] == 'string' && object[k].toLowerCase().includes(v)
    })

    return filteredArr
}

// Filter which layer to display 
function filterHospital(arr) {
    let nonInsulinInjArr = arr.filter((object) => {
        return typeof object['dosage_form'] == 'string' && (object['dosage_form'].toLowerCase().includes('injection') && !object['active_ingredients'].toLowerCase().includes('insulin'))
    })

    let opioidArr = arr.filter((object) => {
        return typeof object['atc_code'] == 'string' && (object['atc_code'].includes('N02A') && !object['active_ingredients'].toLowerCase().includes('tramadol') && !object['active_ingredients'].toLowerCase().includes('codeine'))
    })

    displayHospitalArr = nonInsulinInjArr.concat(opioidArr)

    return displayHospitalArr
}

function filterClassification(arr) {
    let classificationArr = arr.map((object) => {
        return object['forensic_classification']
    })

    let uniqueClassificationArr = classificationArr.filter((str, i, arr) => {
        return arr.indexOf(str) === i
    })

    return uniqueClassificationArr
}

// Create table data (td) function
function createTableData(arr, i, k) {
    let td = document.createElement('td')
    td.innerHTML = (arr[i][k]).toUpperCase()
    td.classList.add(k)

    return td
}

// Sorting function for table data - W3School sort table 
function sortTable(n) {
    let switchCount = 0;
    let table = document.querySelector('#drug-table');
    let switching = true;
    let dir = 'ascending';

    while (switching) {
        switching = false;
        let rows = table.rows;

        let shouldSwitch = false;
        let row_1 = null;
        let row_2 = null;
        for (let i = 1; i < (rows.length - 1); i++) {

            row_1 = rows[i]
            row_2 = rows[i + 1]

            if (dir == 'ascending') {
                if (row_1.childNodes[n].innerHTML > row_2.childNodes[n].innerHTML) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == 'descending') {
                if (row_1.childNodes[n].innerHTML < row_2.childNodes[n].innerHTML) {
                    shouldSwitch = true;
                    break;
                }
            }
        }

        if (shouldSwitch) {
            row_1.parentNode.insertBefore(row_2, row_1);
            switching = true;
            switchCount++;
        } else {
            if (switchCount == 0 && dir == 'ascending') { //Why this line 
                dir = 'descending';
                switching = true;
            }
        }
    }
}

// Create alert function
function createAlert(color, message, class_name = null) {
    document.querySelector('.alert-container').innerHTML = `
    <div class="alert alert-${color} alert-dismissible fade show w-100" role="alert">
        ${message} <a href='#legend-container' class='show-legend'><i class="fa-solid fa-circle-info ms-1 ${class_name}"></i></a>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`
    document.querySelector('.alert-container-sm').innerHTML = `
    <div class="alert alert-${color} alert-dismissible fade show w-100" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`
    document.querySelector('.show-legend').addEventListener('click', function () {
        document.querySelector('#legend-container').classList.add('p-5');
        document.querySelector('.btn-close-legend').classList.add('mb-4');
        document.querySelector('#legend-container-row').classList.add('gy-4');
        document.querySelector('#legend-container').style.maxHeight = '500px'
    })
}

//Cache
let cache = {}

//Main Search Function 
async function main(){

    // Reset map 
    initialDisplay()
    let displayGsl = false;
    let displayPmed = false;
    let displayPom = false;
    let displayHospital = false;
    let displays = [];
    
    // Display table, reset innerHTML of tbody, display table toggle on map 
    let table = document.querySelector('table');
    table.classList.add('d-sm-table');
    
    let tbody = document.querySelector('tbody');
    tbody.innerHTML = "";
    table.appendChild(tbody);
    
    let toggle = document.querySelector('#toggle');
    toggle.classList.add('d-sm-flex');

    let navigationResults = document.querySelector('#expand-search-navigation-sm');
    navigationResults.innerHTML = ''

    document.querySelector('.result-alert').classList.add('d-none')

    //
    let alertContainer = document.querySelector('.alert-container')
    let alertContainerSm = document.querySelector('.alert-container-sm')
    
    // Reset the arrow icon in the table 
    document.querySelector('.fa-angle-up').style.display = 'inline-block';
    document.querySelector('.fa-angle-down').style.display = 'none';
    document.querySelector('#sort-classification-ascending').style.display = 'inline-block';
    document.querySelector('#sort-classification-descending').style.display = 'none';

    // To filter data to match search value with product name or active ingredient
    let searchValue = document.querySelector('#map-search-input').value

    let filteredArr_1 = await filterSearch('product_name', searchValue.toLowerCase())
    let filteredArr_2 = await filterSearch('active_ingredients', searchValue.toLowerCase())
    let combinedFilteredArr = filteredArr_1.concat(filteredArr_2)

    // If no search results yield 
    if (combinedFilteredArr.length == 0) {

        // Display alert 
        createAlert('danger', 'Medication Not Available in Singapore', 'd-none');

        // Hide table and table toggle on map 
        table.classList.remove('d-sm-table');
        toggle.classList.remove('d-sm-flex');

        // Remove all layers on map 
        removeGsl();
        removePmed();
        removePom();
        removeHospital();

        // Store above map layers in displays array  
        displays.push(removeGsl, removePmed, removePom, removeHospital)
    } else {
        // Display result alert in small screen 
        document.querySelector('.result-alert').classList.remove('d-none')
    }
    
    // To display filteredArr on table 
    for (let i = 0; i < combinedFilteredArr.length; i++) {

        // Create rows 
        let tr = document.createElement('tr')
        tr.id = `row-${i}`
        tbody.appendChild(tr)

        // Create table data 
        let td1 = createTableData(combinedFilteredArr, i, 'product_name')

        let td2 = document.createElement('td')
        let split = combinedFilteredArr[i].active_ingredients.split('&&')
        if (Array.isArray(split)) {
            let ul = document.createElement('ul')
            td2.appendChild(ul)
            for (let i of split) {
                i = i.toLowerCase();
                let li = document.createElement('li')
                li.className = 'active_ingredients_list'
                ul.appendChild(li)
                li.innerHTML = i
            }
        }
        td2.classList.add('text-capitalize', 'active_ingredients')

        let td3 = createTableData(combinedFilteredArr, i, 'dosage_form')
        td3.classList.add('d-none', 'd-lg-table-cell')
        let td4 = createTableData(combinedFilteredArr, i, 'forensic_classification')

        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
        tr.appendChild(td4)

        // To display filteredArr on search-navigation on small screen
        let navigationResultsChild = document.createElement('div');
        navigationResultsChild.classList.add('card', 'mx-auto', 'my-3', 'drug-card')
        navigationResultsChild.innerHTML =`
        <div class="card-header drug-card-header">
            <h5>${combinedFilteredArr[i]['product_name']}</h5>
        </div>
        <div class="card-body drug-card-body">
            <p class="card-text">Active Ingredients: ${combinedFilteredArr[i]['product_name']}</p>
            <p class="card-text">Dosage Form: ${combinedFilteredArr[i]['active_ingredients'].split('&&')}</p>
            <p class="card-text">Classification: ${combinedFilteredArr[i]['forensic_classification']}</p>
        </div>`

        navigationResults.appendChild(navigationResultsChild)


    }

    // Check classification of search results to determine which layer(s) to display on map
    for (let classification of filterClassification(combinedFilteredArr)) {
        if (classification.toLowerCase().includes('prescription')) {
            displayPom = true
        }
        if (classification.toLowerCase().includes('pharmacy')) {
            displayPmed = true
        }
        if (classification.toLowerCase().includes('general')) {
            displayGsl = true
        }
    }

    //console.log(displayGsl, displayPmed, displayPom, filterClassification(combinedFilteredArr))

    if (displayPom) {
        createAlert('success', 'This is a <strong>Prescription Only Medication</strong>')
        removeGsl();
        addPom();

        displays.push(removeGsl, addPom)
    }

    if (displayPmed) {
        createAlert('info', 'This is a <strong>Pharmacy Only Medication</strong>')
        removeGsl();
        removePom();
        addPmed();

        displays.push(removeGsl, removePom, addPmed)
    }

    if (displayGsl) {
        createAlert('warning', 'This is under <strong>General Sales List</strong>')
        initialDisplay();

        displays = []
    }

    if (displayGsl && displayPmed) {
        createAlert('danger', 'This medication is available under either <strong>Pharmacy Only Medication</strong> or <strong>General Sales List</strong>. <br>Please refer to the table below or speak to a Pharmacist to find out more.')
    }

    if (displayPom && displayPmed) {
        createAlert('secondary', 'This medication is available under either <strong>Prescription Only Medication</strong> or <strong>Pharmacy Only Medication</strong>. <br>Please refer to the table below or speak to a Pharmacist to find out more.')
    }

    if (displayPom && displayPmed && displayGsl) {
        createAlert('danger', 'This medication is available as <strong>Prescription Only Medication</strong> or <strong>Pharmacy Only Medication</strong> or <strong>General Sales list</strong> item. <br>Please refer to the table below or speak to a Pharmacist to find out more.')
    }

    if (filterHospital(combinedFilteredArr).length > 0) {
        displayHospital = true;
    }

    console.log(filterHospital(combinedFilteredArr))

    if (displayHospital) {
        createAlert('primary', 'This medication is only available in the <strong>hospital</strong>')
        removeGsl();
        removePmed();
        removePom();

        displays.push(removeGsl, removePmed, removePom)
    }

    // Adding search history into dropdown
    let dropdownItem = document.createElement('li')
    dropdownItem.innerHTML = `<a class="dropdown-item" href="#">${searchValue}</a>`
    document.querySelector('.dropdown-menu').appendChild(dropdownItem)

    // Store all into cache 
    cache[`${searchValue}`] = {
        'table': table.cloneNode(true),
        'tbody': tbody.cloneNode(true),
        'alertContainer': alertContainer.cloneNode(true),
        'alertContainerSm': alertContainerSm.cloneNode(true),
        'displays': [...displays]
    }

    // Display respective dropdown items by accessing cache 
    dropdownItem.addEventListener('click', function () {

        // Reset table and display cache 
        document.querySelector('table').remove()
        document.querySelector('#table-div').appendChild(cache[dropdownItem.innerText].table)

        // Set value in search input as the dropdown text 
        document.querySelector('#map-search-input').value = dropdownItem.innerText

        // Reset alert and display cache 
        document.querySelector('.alert-container').remove()
        document.querySelector('#alert-container').appendChild(cache[dropdownItem.innerText].alertContainer)
        document.querySelector('.alert-container-sm').remove()
        document.querySelector('#alert-container-sm').appendChild(cache[dropdownItem.innerText].alertContainerSm)

        document.querySelector('.show-legend').addEventListener('click', function () {
            document.querySelector('#legend-container').classList.add('p-5');
            document.querySelector('.btn-close-legend').classList.add('mb-4');
            document.querySelector('#legend-container-row').classList.add('gy-4');
            document.querySelector('#legend-container').style.maxHeight = '500px'
        })

        document.querySelector('table').classList.add('d-sm-table');
        document.querySelector('#toggle').classList.add('d-sm-flex');

        // Reset map display and display cache 
        initialDisplay()

        if (cache[dropdownItem.innerText].displays.length > 0) {
            for (let display of cache[dropdownItem.innerText].displays) {
                display()
            }
        }

    })
}