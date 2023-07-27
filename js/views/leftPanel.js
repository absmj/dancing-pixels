const leftPanel = () => {    
    switch(store.state.stage.current) {
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
                    ${store.state.points.map((p, k) => `<div class="${k == store.state.selectedPoint ? 'fw-bold' : ""}"><code>X: ${p.x}; Y: ${p.y}</code></div>`).join("")}
                </div>
            `
    
        case 3:
            if(!store.state.selectedPoint) return '';
            return `
                <div>
                    <h6>${store.state.languages[store.state.lang][33].heading}</h6>
                    <hr>
                    <div><code>X: ${store.state.points[store.state.selectedPoint]?.x}; Y: ${store.state.points[store.state.selectedPoint]?.y}</code></div>
                </div>
            `

        case 4:
            return `
                <div>
                    <h6>${store.state.languages[store.state.lang][34].heading}</h6>
                    <hr>
                    ${store.state.audio ? store.state.audio : '<i>Musiqi seçilməyib</i>'}
                </div>
            `;
    }

}