const rightPanel = () => {
    let template = ``;
    
    switch(store.state.stage.currentStage) {
        case 1:
            template = `
                <div>
                    <h6>${store.state.languages[store.state.lang][new String(3 + store.state.stage.currentStage)].heading}</h6>
                    <hr>
                    ${store.state.image ? `` : `<i>Şəkil yüklənməyib</i>`}
                </div>
            `;
            break;
    }

    return template
}