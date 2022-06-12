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
        let alertContainer = document.querySelector('#alert-container')
        alertContainer.innerHTML = '';
        document.querySelector('.table-alert').style.display = 'none'

        if (combinedFilteredArr.length == 0) {
            createAlert('danger', 'Medication Not Available in Singapore');
            document.querySelector('.table-alert').style.display = 'block' //WORK ON MOBILE RESPONSIVENESS
        } 

        // To display filteredArr on table 
        document.querySelector('table').classList.remove('d-none')
        let tbody = document.querySelector('tbody')
        tbody.innerHTML = ""

        let accordionContainer = document.querySelector('#accordion')
        accordionContainer.innerHTML = ''

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

        if (combinedFilteredArr.length > 0){
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
            createAlert('success', 'POM')
            removeGsl();
            addPom();
        }

        if (displayPmed) {
            createAlert('info', 'PMed')
            removeGsl();
            removePom();
            addPmed();
        }

        if (displayGsl) {
            createAlert('warning', 'GSL')
            initialDisplay();
        }
        
        if(displayGsl && displayPmed){
            createAlert('danger', 'PMed/GSL')
        }

        if(displayPom && displayPmed){
            createAlert('secondary', 'PMed/POM')
        } 

        if(displayPom && displayPmed && displayGsl){
            createAlert('danger', 'POM/PMED/GSL')
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
            createAlert('primary', 'Hospital')
            removeGsl();
            removePmed();
            removePom();
        }
    }
})

document.querySelector('#brand-name').addEventListener('click', function () {
    if (document.querySelector('.fa-angle-up').style.display == 'inline-block'){
        document.querySelector('.fa-angle-up').style.display = 'none'
        document.querySelector('.fa-angle-down').style.display = 'inline-block'
    } else {
        document.querySelector('.fa-angle-up').style.display = 'inline-block'
        document.querySelector('.fa-angle-down').style.display = 'none'
    }
    sortTable(0)
})

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

document.querySelector('#collapse-btn').addEventListener('click', function(){
    if (document.querySelector('#collapse-btn').ariaExpanded){
        document.querySelector('#alert-container').style.top = '143px'
        console.log('true')
    } 
    if (!document.querySelector('#collapse-btn').ariaExpanded){
        document.querySelector('#alert-container').style.top = '60px'
    } //this does not work 
})
