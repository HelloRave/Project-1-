let accordionContainer = document.querySelector('#accordion')

let accordionItem = document.createElement('div')
accordionItem.className = 'accordion-item'
accordionItem.innerHTML = `
<h2 class="accordion-header" id="headingFour">
    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="true" aria-controls="collapseFour">
        Accordion Item #4
    </button>
</h2>
<div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingFour">
    <div class="accordion-body">
        xxxx
    </div>
</div>`
accordionContainer.appendChild(accordionItem)