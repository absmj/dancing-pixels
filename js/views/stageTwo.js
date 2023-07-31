const stageTwo = {
    view() {
        return `
        <div id="stage-2" class="p-2">
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
    },

    state: {
            id: 2,

            mount() {
                store.state.canvas.addEventListener("mousedown", store.canvasSelectingPoints);
                store.state.canvas.addEventListener("mousemove", store.canvasDragingPoints);
                store.state.canvas.addEventListener("mouseup", store.canvasDragingEnd);
                store.state.warper = new ImgWarper.PointDefiner(store.state.canvas, store.state.image, store.state.imageData)
                document.getElementById("result").append(store.state.canvas)
                // document.getElementById(`s2`).innerHTML = store.state.stage.panel(1)

            },

            destroyed() {
                store.state.canvas.removeEventListener("mousedown", store.canvasSelectingPoints);
                store.state.canvas.removeEventListener("mousemove", store.canvasDragingPoints);
                store.state.canvas.removeEventListener("mouseup", store.canvasDragingEnd);
            }
        }
}
