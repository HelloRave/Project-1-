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
    td.innerHTML = arr[i][k]
    td.classList.add(k)

    return td
}

// Sorting function for table data - W3School sort table 
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

// Create alert function
function createAlert(color, message, class_name=null){
    document.querySelector('#alert-container').innerHTML = `
    <div class="alert alert-${color} alert-dismissible fade show w-100 ${class_name}" role="alert">
        ${message} 
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`
}