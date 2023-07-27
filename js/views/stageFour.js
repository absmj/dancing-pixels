const stageFour = data => `
    <div id="stage-1" class="p-2">
        <div class="head">
            <h4>${store.state.languages[store.state.lang][34].heading}</h4>
            
            <p id="desc" class="text-white">${store.state.languages[store.state.lang][34].desc}</p>
        </div>
        <div class="d-flex justify-content-center" id="result">
        </div>

        <div class="d-grid gap-2 mt-2">
            <input type="file" data-type="audio" id="audio" accept=".mp3" class="d-none"/>
            <button id="upload-audio" class="btn btn-primary color-pink">${store.state.languages[store.state.lang][31].upload}</button>
        </div>
    </div>
`