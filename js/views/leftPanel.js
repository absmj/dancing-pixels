const leftPanel = (stage) => {    
    switch(stage || store.state.stage.current) {
        case 1:
            return `
                <div>
                    <h6>${store.state.languages[store.state.lang][31].heading}</h6>
                    <hr>
                    ${store.state.file.image ? store.state.file.image : '<i>Şəkil seçilməyib</i>'}
                </div>
            `;

        case 2:
            return `
                <div>
                    <h6>${store.state.languages[store.state.lang][32].heading}</h6>
                    <hr>
                    ${store.state.warper.oriPoints.map((p, k) => `<div class="${k == store.state.warper.currentPointIndex ? 'fw-bold' : ""}"><code>X: ${p.x}; Y: ${p.y}</code></div>`).join("")}
                </div>
            `
    
        case 3:
            if(store.state.warper.dstPoints[store.state.selectedPoint]) {
                const {x, y} = store.state.warper.dstPoints[store.state.selectedPoint]
                return `
                    <div>
                        <h6>${store.state.languages[store.state.lang][33].heading}</h6>
                        <hr>
                        <div><code>X: ${x.toFixed(2)}; Y: ${y.toFixed(2)}</code></div>
                    </div>
                `
            }

        case 4:
            return `
                <div>
                    <h6>${store.state.languages[store.state.lang][34].heading}</h6>
                    <hr>
                    ${store.state.audio ? store.state.file.audio : '<i>Musiqi seçilməyib</i>'}
                </div>
            `;
    }

}