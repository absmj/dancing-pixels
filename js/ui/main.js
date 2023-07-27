const app = {
    el: "app",
    methods: {
        generationTable() {
            app.el.innerHTML = `
                <div class="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                    ${store.state.stage.list.map(l => 
                        `<button class="nav-link${store.state.stage.current == l.id ? ' active' : ''}" id="v-pills-${l.id}-tab" data-bs-toggle="pill" data-bs-target="#v-pills-${l.id}" type="button" role="tab" aria-controls="v-pills-${l.id}" aria-selected="true">
                            ${store.state.languages[store.state.lang][l.title]}
                        </button>`
                    ).join("")}
                </div>
                <div class="tab-content" id="v-pills-tabContent">
                    ${store.state.stage.list.map(l => 
                        `<div class="row tab-pane${store.state.stage.current == l.id ? ' active show' : ''}" id="v-pills-${l.id}" role="tabpanel" tabindex="0">                        
                            ${store.state.stage.view(l)}
                        </div>`
                    ).join("")}
                </div>
                
            `
        },

        mainPanel() {
            document.getElementById("main-panel").innerHTML = store.state.stage.view()
            return this;
        },

        leftPanel() {
            document.getElementById("s1").innerHTML = store.state.stage.panel(1)
            return this;
        },
    },



    mounted() {
        store.views = views;
        this.el = document.getElementById(this.el)
        this.methods.leftPanel().mainPanel();
        store.state.stage.currentStage.mount();
        // this.methods.generationTable()
    },

}

window.onload = () => {
    app.mounted()
}
