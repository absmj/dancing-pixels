const store = {
    state: {
        file: {
            image: null,
            audio: null
        },
        image: null,
        imageData: null,
        points: [],
        audio: null,
        audioData: null,
        selectedPoint: null,
        pointDefiner: null,
        warper: null,
        canvas: null,
        stage: {
            current: 1,
            views: null,

            
            nextStage() {
                const stage = store.state.stage
                stage.currentStage.state?.destroyed instanceof Function && stage.currentStage.state.destroyed();

                if (stage.current < 4)
                stage.currentStage = stage.current + 1;
                
            },
            
            get currentStage() {
                return views.stages.find(l => l.id == this.current)
            },

            set currentStage(s) {
                this.current = s;
                document.getElementById("main-panel").innerHTML = this.currentStage.view()
                document.getElementById("nextStage-button")?.removeEventListener("click", store.state.stage.nextStage)
                document.getElementById("nextStage-button")?.addEventListener("click", store.state.stage.nextStage)
                this.currentStage.state.mount()
            },

            panel(id, stage = null) {
                return views.panels.find(v => v.id == id)?.view(stage)
            }
        },


        lang: null,
        languages,

        handleFile({ f, t }) {
            const file = f.files[0]
            this.file[t] = file.name
            const extension = file.name.split('.').pop().toLowerCase()
            const fileContent = new FileReader()
            this.stage.currentStage.state.handleFile(extension, fileContent, file)
        }
    },

    set canvas(c) {
        this.state.canvas = c;
    },

    set point(p) {
        if (this.state.stage.current != 2) return;
        // this.state.warper.redrawCanvas(this.state.points)

        if (this.state.warper.oriPoints.length > 3) {
            document.getElementById("nextStage-button").disabled = false;
        }
    },

    canvasSelectingPoints: e => {
        store.point = store.state.warper.touchStart(e)
        document.getElementById(`s2`).innerHTML = store.state.stage.panel(1, 2)
    },


    canvasDragingPoints: e => {
        store.state.warper.touchDrag(e)
    },

    canvasDragingEnd: e => {
        store.state.warper.touchEnd(e)
    },

    canvasSelectPoint: e => {
        store.state.warper.currentPointIndex = store.state.warper.selectPoint(e)
        if (store.state.warper.currentPointIndex >= 0) {
            store.selectedPoint = store.state.warper.currentPointIndex
            document.getElementById("nextStage-button").disabled = false
            // document.getElementById(`s3`).innerHTML = store.state.stage.panel(1);
        }
    },

    set selectedPoint(p) {
        this.state.selectedPoint = p
        document.getElementById(`s3`).innerHTML = store.state.stage.panel(1, 3);
    },

    set warper(w) {

    },

    set file({ f, t }) {
        if (f) {
            this.state.handleFile({ f, t })
        }
    },


    set views(v) {
        this.state.stage.views = v
    },

    set lang(l) {
        if(l && this.state.languages.hasOwnProperty(l)) {
            this.state.lang = l
            this.state.stage.currentStage = this.state.stage.current
            for(let i = 1; i <= this.state.stage.current; i++) {
                document.getElementById(`s${i}`).innerHTML = this.state.stage.panel(1, i)
            }
            document.getElementById("right-panel").innerHTML = settings()

            document.querySelectorAll(`[data-lang]`)?.forEach(e => e.classList.remove("active"))
            document.querySelector(`[data-lang=${l}]`)?.classList.add("active")
        } 
    },

    resetState() {
        store.state.audio?.pause();
        store.state.stage.currentStage = 1
        store.state.file.image = null;
        store.state.file.audio = null;
        store.state.audio = null;
        store.state.audioData = null;
        store.state.audio = null;
        store.state.image = null;
        store.state.imageData = null;
        store.state.warper = null
        store.state.selectedPoint = null
        document.getElementById("s1").innerHTML = store.state.stage.panel(1)
        document.getElementById("s2").innerHTML = null
        document.getElementById("s3").innerHTML = null
        document.getElementById("s4").innerHTML = null

    }
}