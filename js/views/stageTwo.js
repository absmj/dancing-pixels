const stageTwo = data => `
    <div id="stage-1" class="p-2">
        <div class="head">
            <h4>${store.state.languages[store.state.lang][32].heading}</h4>
            
            <p id="desc" class="text-white">${store.state.languages[store.state.lang][32].desc}</p>
        </div>
        <div class="d-flex justify-content-center" id="result">
        </div>

        <div class="d-grid gap-2 mt-2">
            <button id="nextStage-button" disabled class="btn btn-primary color-pink">${store.state.languages[store.state.lang].nextStage}</button>
        </div>
    </div>
`