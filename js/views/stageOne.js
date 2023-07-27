const stageOne = data => `
    <div id="stage-1" class="p-2">
        <div class="head">
            <h4>${store.state.languages[store.state.lang][31].heading}</h4>
            
            <p id="desc" class="text-white">${store.state.languages[store.state.lang][31].desc}</p>
        </div>
        <div class="d-flex justify-content-center" id="result">
            <canvas></canvas>
        </div>

        <div class="d-grid gap-2 mt-2">
            <input type="file" data-type="image" id="picture" class="d-none"/>
            <button id="upload-picture" class="btn btn-primary color-pink">${store.state.languages[store.state.lang][31].upload}</button>
        </div>
    </div>
`