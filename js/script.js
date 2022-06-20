// Landing Page search for Anarex and dermovate 
document.querySelector('.find-anarex').addEventListener('click', function(){
    main('anarex')
    document.querySelector('body').style.overflow = 'visible'
    document.querySelector('html').style.overflow = 'visible'
    document.querySelector('#map-container').style.height = '100vh';
    document.querySelector('#landing').style.height = 0;
    document.querySelector('#landing').style.overflow = 'hidden';
    document.querySelector('#map-search-input').value = 'Anarex'
})

document.querySelector('.find-dermovate').addEventListener('click', function(){
    main('dermovate')
    document.querySelector('body').style.overflow = 'visible'
    document.querySelector('html').style.overflow = 'visible'
    document.querySelector('#map-container').style.height = '100vh';
    document.querySelector('#landing').style.height = 0;
    document.querySelector('#landing').style.overflow = 'hidden';
    document.querySelector('#map-search-input').value = 'Dermovate'
})

// Display search results when 'Enter' key pressed 
document.querySelector('#map-search-input').addEventListener('keydown', async function (event) {

    if (event.key == 'Enter') {

        main()

    }
})

// Display search results when search button pressed 
document.querySelector('#map-search-btn').addEventListener('click', async function (event) {

    main()

})

// Adjust alert-container based on collapsible tab 
document.querySelector('#collapse-btn').addEventListener('click', function () {
    if (document.querySelector('#collapse-btn').ariaExpanded) {
        document.querySelector('#alert-container').style.top = '135px'
        document.querySelector('#alert-container-sm').style.top = '54px'
    }
    if (document.querySelector('#collapse-btn').classList.contains('collapsed')) {
        document.querySelector('#alert-container').style.top = '54px'
        document.querySelector('#alert-container-sm').style.top = '54px'
    }
})

document.querySelector('.btn-close-legend').addEventListener('click', function () {
    document.querySelector('#legend-container').style.maxHeight = 0;
    document.querySelector('#legend-container').style.overflow = 'hidden';
    document.querySelector('#legend-container').classList.remove('p-5');
    document.querySelector('.btn-close-legend').classList.remove('mb-4');
    document.querySelector('#legend-container-row').classList.remove('gy-4');
})

//Adjust height of navigation expansion 
document.querySelector('#legend-icon').addEventListener('click', function () {
    document.querySelector('#expand-search-navigation-sm').style.height = 0;

    if (document.querySelector('#expand-legend-navigation-sm').style.height != '222px') { 
        document.querySelector('#expand-legend-navigation-sm').style.height = '222px'
    } else {
        document.querySelector('#expand-legend-navigation-sm').style.height = 0
    }
})

document.querySelector('#search-icon').addEventListener('click', function () {
    document.querySelector('#expand-legend-navigation-sm').style.height = 0

    if (document.querySelector('#expand-search-navigation-sm').style.height != '222px') {
        document.querySelector('#expand-search-navigation-sm').style.height = '222px'
    } else {
        document.querySelector('#expand-search-navigation-sm').style.height = 0
    }

    document.querySelector('.result-alert').classList.add('d-none')
})

document.querySelector('#home-icon').addEventListener('click', function () {

    document.querySelector('#landing').style.height = '100vh';
    document.querySelector('#map-container').style.height = 0
    document.querySelector('#map-container').style.overflow = 'hidden'

    document.querySelector('table').classList.remove('d-sm-table');
    document.querySelector('#toggle').classList.remove('d-sm-flex');

    document.querySelector('#legend-container').style.maxHeight = 0;
    document.querySelector('#legend-container').style.overflow = 'hidden';
    document.querySelector('#legend-container').classList.remove('p-5')
})

document.querySelector('#search-home-btn').addEventListener('click', function () {

    document.querySelector('#landing').style.height = '100vh';
    document.querySelector('#map-container').style.height = 0
    document.querySelector('#map-container').style.overflow = 'hidden'

    document.querySelector('table').classList.remove('d-sm-table');
    document.querySelector('#toggle').classList.remove('d-sm-flex');

    document.querySelector('#legend-container').style.maxHeight = 0;
    document.querySelector('#legend-container').style.overflow = 'hidden';
    document.querySelector('#legend-container').classList.remove('p-5')
})

document.querySelector('#home-search-btn').addEventListener('click', function () {
    document.querySelector('body').style.overflow = 'visible'
    document.querySelector('html').style.overflow = 'visible'
    document.querySelector('#map-container').style.height = '100vh';
    document.querySelector('#landing').style.height = 0;
    document.querySelector('#landing').style.overflow = 'hidden';
})