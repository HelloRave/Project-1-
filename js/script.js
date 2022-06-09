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

// Sorting function for table data - W3School sort table 

// Create table data (td) function
function createTableData(arr, i, k) {
    let td = document.createElement('td')
    td.innerHTML = arr[i][k]
    td.classList.add(k)

    return td
}

// Display search results when 'Enter' key pressed 
let search = document.querySelector('#search')
search.addEventListener('keydown', async function (event) {

    if (event.key == 'Enter') {

        document.querySelector('.fa-angle-up').style.display = 'inline-block';
        document.querySelector('.fa-angle-down').style.display = 'none'

        // To filter data to match search value with product name or active ingredient
        let searchValue = search.value.toLowerCase()

        let filteredArr_1 = await filterSearch('product_name', searchValue)
        let filteredArr_2 = await filterSearch('active_ingredients', searchValue)
        let combinedFilteredArr = filteredArr_1.concat(filteredArr_2)

        // If no match, display message
        if (combinedFilteredArr.length == 0) {
            document.querySelector('.alert').classList.remove('d-none')
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
            td2.classList.add('text-capitalize', 'active_ingredients')

            let td3 = createTableData(combinedFilteredArr, i, 'dosage_form')
            td3.classList.add('d-none', 'd-lg-table-cell')
            let td4 = createTableData(combinedFilteredArr, i, 'forensic_classification')
            let td5 = createTableData(combinedFilteredArr, i, 'atc_code')


            tr.appendChild(td1)
            tr.appendChild(td2)
            tr.appendChild(td3)
            tr.appendChild(td4)
            tr.appendChild(td5)
        }

        // Reset map 
        initialDisplay()

        // Insert display gsl/pmed/pom here
        let displayGsl = false;
        let displayPmed = false;
        let displayPom = false;

        for (let classification of filterClassification(combinedFilteredArr)){
            if (classification.toLowerCase().includes('prescription')){
                displayPom = true
            }
            if (classification.toLowerCase().includes('pharmacy')){
                displayPmed = true
            }
            if (classification.toLowerCase().includes('general')){
                displayGsl = true
            }
        }

        console.log(displayGsl, displayPmed, displayPom, filterClassification(combinedFilteredArr))

        if(displayPom){
            removeGsl();
            addPom();
        }

        if(displayPmed){
            removeGsl();
            removePom();
            addPmed();
        }

        if(displayGsl){
            initialDisplay();
        }

        // Display FilteredArr on map based on forensic classification or dosage form or atc code
        let displayHospital = false;

        // Determine if only hospital should be shown on map
        console.log(filterHospital(combinedFilteredArr)) //To fix: Searching tramadol will display hospital only because it has injection 

        if (filterHospital(combinedFilteredArr).length > 0) {
            displayHospital = true;
        }

        // Show hospital markers only if criteria met for classification/dosage form/atc code
        if (displayHospital) {
            removeGsl();
            removePmed();
            removePom();
        }
    }
}) 

function sortTable(n){
    let switchCount = 0; 
    let table = document.querySelector('#drug-table');
    let switching = true; 
    let dir = 'ascending';

    while(switching){
        switching = false; 
        let rows = table.rows;

        let shouldSwitch = false;
        let row_1 = null;
        let row_2 = null; 
        for (let i = 1; i < (rows.length - 1); i++){

            row_1 = rows[i]
            row_2 = rows[i + 1]

            if (dir == 'ascending'){
                if (row_1.childNodes[n].innerHTML > row_2.childNodes[n].innerHTML){
                    shouldSwitch = true; 
                    break; 
                }
            } else if (dir == 'descending'){
                if (row_1.childNodes[n].innerHTML < row_2.childNodes[n].innerHTML){
                    shouldSwitch = true; 
                    break; 
                }
            }
        } 

        if (shouldSwitch){
            row_1.parentNode.insertBefore(row_2, row_1);
            switching = true;
            switchCount++; 
        } else {
            if (switchCount == 0 && dir == 'ascending'){ //Why this line 
                dir = 'descending';
                switching = true; 
            }
        }
    }
}

document.querySelector('#sort-name-ascending').addEventListener('click', function(){
    document.querySelector('.fa-angle-up').style.display = 'none';
    document.querySelector('.fa-angle-down').style.display = 'inline-block'
    sortTable(0)
})

document.querySelector('#sort-name-descending').addEventListener('click', function(){
    document.querySelector('.fa-angle-up').style.display = 'inline-block';
    document.querySelector('.fa-angle-down').style.display = 'none'
    sortTable(0)
})

document.querySelector('#sort-classification-ascending').addEventListener('click', function(){
    document.querySelector('.fa-angle-up').style.display = 'none';
    document.querySelector('.fa-angle-down').style.display = 'inline-block'
    sortTable(3)
})

document.querySelector('#sort-classification-descending').addEventListener('click', function(){
    document.querySelector('.fa-angle-up').style.display = 'inline-block';
    document.querySelector('.fa-angle-down').style.display = 'none'
    sortTable(3)
})