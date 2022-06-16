//Cache
let cache = {}

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

        document.querySelector('table').classList.add('d-sm-table')
        let tbody = document.querySelector('tbody')
        tbody.innerHTML = ""

        let accordionContainer = document.querySelector('#accordion')
        accordionContainer.innerHTML = ''

        // If no match, display message
        let alertContainer = document.querySelector('#alert-container')
        alertContainer.innerHTML = '';

        if (combinedFilteredArr.length == 0) {
            createAlert('danger', 'Medication Not Available in Singapore');//WORK ON MOBILE RESPONSIVENESS
            document.querySelector('table').classList.add('d-none')
        }

        // To display filteredArr on table 
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
                    li.style.border = '1px solid black'
                    li.style.marginBottom = '2px'
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

            // Insert Accordion

            let accordionItem = document.createElement('div')
            accordionItem.className = 'accordion-item'
            accordionItem.innerHTML = `
                <h2 class="accordion-header" id="heading-${i}">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${i}" aria-expanded="true" aria-controls="collapse-${i}">
                        ${combinedFilteredArr[i]['product_name']}
                    </button>
                </h2>
                <div id="collapse-${i}" class="accordion-collapse collapse" aria-labelledby="heading-${i}">
                    <div class="accordion-body">
                        ${combinedFilteredArr[i]['forensic_classification']}
                    </div>
                </div>`
            accordionContainer.appendChild(accordionItem)
        }

        if (combinedFilteredArr.length > 0) {
            document.querySelector('#collapse-0').classList.add('show')
        }

        // Reset map 
        initialDisplay()

        // Insert display gsl/pmed/pom here
        let displayGsl = false;
        let displayPmed = false;
        let displayPom = false;

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

        console.log(displayGsl, displayPmed, displayPom, filterClassification(combinedFilteredArr))

        if (displayPom) {
            createAlert('success', 'This is a <strong>Prescription Only Medication</strong>')
            removeGsl();
            addPom();
        }

        if (displayPmed) {
            createAlert('info', 'This is a <strong>Pharmacy Only Medication</strong>')
            removeGsl();
            removePom();
            addPmed();
        }

        if (displayGsl) {
            createAlert('warning', 'This is under <strong>General Sales List</strong>')
            initialDisplay();
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

        // Display FilteredArr on map based on forensic classification or dosage form or atc code
        let displayHospital = false;

        // Determine if only hospital should be shown on map
        console.log(filterHospital(combinedFilteredArr)) //To fix: Searching tramadol will display hospital only because it has injection 

        if (filterHospital(combinedFilteredArr).length > 0) {
            displayHospital = true;
        }

        // Show hospital markers only if criteria met for classification/dosage form/atc code
        if (displayHospital) {
            createAlert('primary', 'This medication is only available in the <strong>hospital</strong>')
            removeGsl();
            removePmed();
            removePom();
        }

        // Adding search history into dropdown
        let dropdownItem = document.createElement('li')
        dropdownItem.innerHTML = `<a class="dropdown-item" href="#">${search.value}</a>`
        document.querySelector('.dropdown-menu').appendChild(dropdownItem)

        cache[`${search.value}`] = {
            'tbody': tbody.cloneNode(true),
            'accordionContainer': accordionContainer.cloneNode(true)
        } //CORRECTED: key is correct but value is wrong - remains as latest - shallow copy 

        dropdownItem.addEventListener('click', function () {
            // console.log(dropdownItem.innerText, cache, cache[dropdownItem.innerText])
            // To add for accordion, alert container, input value, markercluster and markers 
            tbody.remove()
            document.querySelector('table').appendChild(cache[dropdownItem.innerText].tbody) 
        })
    }
})



// Sort table based on brand name 
document.querySelector('#brand-name').addEventListener('click', function () {
    if (document.querySelector('.fa-angle-up').style.display == 'inline-block') {
        document.querySelector('.fa-angle-up').style.display = 'none'
        document.querySelector('.fa-angle-down').style.display = 'inline-block'
    } else {
        document.querySelector('.fa-angle-up').style.display = 'inline-block'
        document.querySelector('.fa-angle-down').style.display = 'none'
    }
    sortTable(0)
})

// Sort table based on classification 
document.querySelector('#sort-classification-ascending').addEventListener('click', function () {
    document.querySelector('.fa-angle-up').style.display = 'none';
    document.querySelector('.fa-angle-down').style.display = 'inline-block'
    sortTable(3)
})

document.querySelector('#sort-classification-descending').addEventListener('click', function () {
    document.querySelector('.fa-angle-up').style.display = 'inline-block';
    document.querySelector('.fa-angle-down').style.display = 'none'
    sortTable(3)
})

// Adjust alert-container based on collapsible tab 
document.querySelector('#collapse-btn').addEventListener('click', function () {
    if (document.querySelector('#collapse-btn').ariaExpanded) {
        document.querySelector('#alert-container').style.top = '143px'
        document.querySelector('#alert-container-sm').style.top = '240px'
    }
    if (document.querySelector('#collapse-btn').classList.contains('collapsed')) {
        document.querySelector('#alert-container').style.top = '60px'
        document.querySelector('#alert-container-sm').style.top = '100px'
    }
})

document.querySelector('.btn-close-legend').addEventListener('click', function () {
    document.querySelector('#legend-container').style.maxHeight = 0;
    document.querySelector('#legend-container').style.overflow = 'hidden';
    document.querySelector('#legend-container').classList.remove('pt-5', 'pb-5');

})