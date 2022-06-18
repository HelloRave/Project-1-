// Sort table based on brand name 
document.querySelector('#brand-name').addEventListener('click', function () {
    document.querySelector('#sort-classification-ascending').style.display = 'inline-block'
    document.querySelector('#sort-classification-descending').style.display = 'none'

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
document.querySelector('#classification').addEventListener('click', function () {
    document.querySelector('.fa-angle-up').style.display = 'inline-block'
    document.querySelector('.fa-angle-down').style.display = 'none'

    if (document.querySelector('#sort-classification-ascending').style.display == 'inline-block') {
        document.querySelector('#sort-classification-ascending').style.display = 'none'
        document.querySelector('#sort-classification-descending').style.display = 'inline-block'
    } else {
        document.querySelector('#sort-classification-ascending').style.display = 'inline-block'
        document.querySelector('#sort-classification-descending').style.display = 'none'
    }
    sortTable(3)
})
