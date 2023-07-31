const stageThree = {
    view() {
        return `
        <div id="stage-3" class="p-2">
            <div class="head">
                <h4>${store.state.languages[store.state.lang][33].heading}</h4>
                
                <p id="desc" class="text-white">${store.state.languages[store.state.lang][33].desc}</p>
            </div>
            <div class="d-flex justify-content-center" id="result">
            </div>
    
            <div class="d-grid gap-2 mt-2">
                <button id="nextStage-button" disabled class="btn btn-primary color-pink">${store.state.languages[store.state.lang].nextStage}</button>
            </div>
        </div>
            `
    },

    state: {
            id: 3,
            mount() {
                document.getElementById("result").append(store.state.canvas)
                store.state.canvas.addEventListener("click", store.canvasSelectPoint);
                // document.getElementById(`s3`).innerHTML = store.state.stage.panel(1)

            },
            destroyed() {
                store.state.canvas.removeEventListener("click", store.canvasSelectPoint);
                // document.getElementById("result").append(store.state.canvas)
            }
        }
}