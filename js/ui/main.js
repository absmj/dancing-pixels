const app = {
    el: "app",
    methods: {
        mainPanel() {
            document.getElementById("main-panel").innerHTML = store.state.stage.currentStage.view()
            return this;
        },

        leftPanel() {
            document.getElementById("s1").innerHTML = store.state.stage.panel(1)
            return this;
        },
    },


    created() {
        var url_string = window.location.href; 
        var url = new URL(url_string);
        var lang = url.hash.substring(1);
        store.views = views;
        store.lang = lang || 'az'
    },


    mounted() {

        const sidebar = document.querySelector(".sidebar")
        const backdrop = document.querySelector(".backdrop")
        document.getElementById("close").addEventListener("click", () => {
            backdrop.classList.add("d-none")
            sidebar.classList.remove("d-block")
            sidebar.classList.add("d-none")
        })

        document.getElementById("toggler")?.addEventListener("click", () => {
            sidebar.classList.add("d-block")
            sidebar.classList.remove("d-none")
            backdrop.classList.remove("d-none")
        })

        document.querySelectorAll(".language")?.forEach(l => {
            l.addEventListener("click", (e) => {
                store.lang = e.target.dataset.lang
            })
        })

        this.methods.leftPanel().mainPanel();
        store.state.stage.currentStage.state.mount();
    },

}

document.onreadystatechange = function(e)
{
    if (document.readyState === 'complete')
    {
        app.created();
    }
};

window.onload = () => {
    app.mounted()
}
