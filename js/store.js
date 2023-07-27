const max = 128, min = 0;
let easing = 1, x = 1, y = 1;
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
            list: [
                {
                    id: 1,
                    uploadPicture() {
                        const file = document.getElementById("picture")
                        file.click()
                    },

                    handleFile(extension, fileContent, file) {
                        if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
                            fileContent.onload = () => {
                                this.render(fileContent.result, (imageData) => {
                                    store.state.imageData = imageData;
                                })
                                this.beforeDestroy()
                            }
                            fileContent.readAsDataURL(file)
                        } else throw new Error("Unsupported file")
                    },

                    render(src, callback = null) {
                        const image = new Image();
                        const canvas = store.state.canvas;

                        image.onload = function () {
                            const optimalSize = window.screen.height / 2
                            if (image.height > optimalSize) {
                                image.width *= optimalSize / image.height;
                                image.height = optimalSize;
                            }
                            var ctx = canvas.getContext("2d");
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            canvas.width = image.width;
                            canvas.height = image.height;
                            ctx.drawImage(image, 0, 0, image.width, image.height);
                            store.state.image = image
                            if (callback instanceof Function)
                                callback(ctx.getImageData(0, 0, image.width, image.height));
                        };
                        image.src = src;
                        return image;
                    },

                    mount() {
                        const file = document.getElementById("picture")
                        store.canvas = document.querySelector("#result > canvas");
                        document.getElementById("upload-picture").addEventListener("click", this.uploadPicture)
                        file.addEventListener("change", (e) => store.file = { f: e.target, t: e.target.dataset.type });
                    },

                    beforeDestroy() {
                        document.getElementById("desc").innerHTML = store.state.languages[store.state.lang][31].uploaded
                        const button = document.getElementById("upload-picture")
                        button.id = "nextStage-button"
                        button.innerHTML = store.state.languages[store.state.lang].nextStage
                        button.removeEventListener("click", this.uploadPicture)
                        button.addEventListener("click", store.state.stage.nextStage)
                    },
                },
                {
                    id: 2,

                    mount() {
                        store.state.canvas.addEventListener("mousedown", store.canvasSelectingPoints);
                        store.state.canvas.addEventListener("mousemove", store.canvasDragingPoints);
                        store.state.canvas.addEventListener("mouseup", store.canvasDragingEnd);
                        store.state.warper = new ImgWarper.PointDefiner(store.state.canvas, store.state.image, store.state.imageData)
                        document.getElementById("result").append(store.state.canvas)
                    }
                },
                {
                    id: 3,
                    mount() {
                        document.getElementById("result").append(store.state.canvas)
                        store.state.canvas.removeEventListener("click", store.canvasSelectingPoints);
                        store.state.canvas.addEventListener("click", store.canvasSelectPoint);
                    },
                    destroyed() {
                        // document.getElementById("result").append(store.state.canvas)
                    }
                },
                {
                    id: 4,

                    generate(frames) {
                        let clientX = (frames[Math.floor(Math.random() * (max - min) + min)]);
                        let clientY = (frames[Math.floor(Math.random() * (max - min) + min)]);
                        let {x, y} = findOptimalCoordinates(store.state.warper.oriPoints, store.state.warper.selectedPoint, {x: clientX, y: clientY});
                        // return;
                        // x -= store.state.canvas.offsetLeft
                        // y -= store.state.canvas.offsetLeft
                        // const te = new MouseEvent("mouseup");
                        //             // const up = new MouseEvent("mouseup")
                        // if (typeof x == "number" && typeof y == "number") {
                        //     const evt = new MouseEvent("mousemove", {
                        //         clientX: x,
                        //         clientY: y,
                        //         bubbles: true,
                        //         cancelable: false,
                        //         view: window
                        //     })
                        //     store.state.canvas.dispatchEvent(evt);
                        //     // store.state.canvas.dispatchEvent(click); 
                        //     // store.state.canvas.dispatchEvent(te);
                        // }

                        const dst = store.state.points;
                        dst[store.state.selectedPoint] = new ImgWarper.Point(x, y)
                        store.state.warper.redrawCanvas(dst)
                        store.state.warper.imgWarper.warp(store.state.points, dst)
                        
                    },

                    handleFile(extension, fileContent, file) {
                        if (["mp3"].includes(extension)) {
                            fileContent.onload = () => {
                                this.render(fileContent.result, audioData => {
                                    store.state.audioData = audioData
                                })

                            }
                            fileContent.readAsDataURL(file)
                        } else throw new Error("Unsupported file")
                    },

                    render(src, callback = null) {
                        const audio = new Audio(src);
                        store.state.audio = audio;
                        analyser = new AudioAnalyzer(audio);
                        analyser.analyzing();
                        audio.addEventListener('canplaythrough', () => {
                            audio.play();
                            callback instanceof Function && callback();
                        }, false);

                        //  console.log
                        audio.addEventListener("timeupdate", () => {
                            const a = analyser.getFrame();
                            this.generate(a, store.state.warper.oriPoints[store.state.selectedPoint])
                        })
                    },

                    uploadAudio() {
                        const file = document.getElementById("audio")
                        file.click()
                    },

                    beforeDestroy() {
                        // document.getElementById("desc").innerHTML = store.state.languages[store.state.lang][31].uploaded
                        const button = document.getElementById("upload-audio")
                        button.id = "nextStage-button"
                        button.innerHTML = store.state.languages[store.state.lang].nextStage
                        button.removeEventListener("click", this.uploadAudio)
                        // button.addEventListener("click", store.state.stage.nextStage)
                    },

                    mount() {
                        const button = document.getElementById("upload-audio")
                        const file = document.getElementById("audio")
                        button.addEventListener("click", this.uploadAudio)
                        document.getElementById("result").append(store.state.canvas)
                        // store.state.canvas.addEventListener("mousemove", (e) => store.state.warper.touchDrag(e));
                        // document.getElementById("run").addEventListener("click", () => this.generate())
                        file.addEventListener("change", (e) => store.file = { f: e.target, t: e.target.dataset.type });
                    }
                }
            ],

            views: null,

            get currentStage() {
                return this.list.find(l => l.id == this.current)
            },

            nextStage() {
                const stage = store.state.stage
                if (stage.current < 4)
                    stage.currentStage = ++stage.current;
                stage.currentStage?.destroyed instanceof Function && stage.currentStage.destroyed();

            },

            set currentStage(s) {
                this.current = s;
                document.getElementById(`s${s}`).innerHTML = store.state.stage.panel(1)
                document.getElementById("main-panel").innerHTML = store.state.stage.view()
                document.getElementById("nextStage-button")?.removeEventListener("click", store.state.stage.nextStage)
                this.currentStage.mount()
                document.getElementById("nextStage-button")?.addEventListener("click", store.state.stage.nextStage)
            },

            view(data = null) {
                if (!data) {
                    data = store.state.stage.currentStage
                }

                return views.stages.find(v => v.stage == data.id)?.view(data)
            },

            panel(id) {
                return views.panels.find(v => v.id == id)?.view()
            }
        },


        lang: "az",
        languages: {
            az: {
                31: {
                    heading: "Şəkil",
                    desc: "Başlamaq üçün şəkil seçin",
                    upload: "Yüklə",
                    uploaded: "Şəkil seçildi. Növbəti mərhələdə şəkil üzərində hərəkət nöqtələri əlavə edəcəksiniz"
                },
                32: {
                    heading: "Hərəkət sərhədi",
                    desc: "Hərəkət sərhədləri şəkil üzərində təyin edilərək, hərəkətin nizamlayıcı funksiyasını yerinə yetirir. Minimum 3 hərəkət sərhədi seçilməlidir.",
                },
                33: {
                    heading: "Həssas nöqtə",
                    desc: "Həssas nöqtə, musiqi tempində reaksiya verən, onun dinamikliyinə əsasən yerdəyişmə edən nöqtədir.",
                },
                34: {
                    heading: "Musiqi",
                    desc: "Son olaraq, musiqi seçin. Şəkil musiqi tempinə uyğun \"canlanacaq\"",
                },
                nextStage: "Növbəti"
            }
        },

        handleFile({ f, t }) {
            const file = f.files[0]
            this.file[t] = file.name
            const extension = file.name.split('.').pop().toLowerCase()
            const fileContent = new FileReader()
            this.stage.currentStage.handleFile(extension, fileContent, file)
        }
    },

    set canvas(c) {
        this.state.canvas = c;
    },

    set point(p) {
        if(this.state.stage.current != 2) return;
        this.state.points.push(p)
        // this.state.warper.redrawCanvas(this.state.points)

        if (this.state.points.length > 3) {
            document.getElementById("nextStage-button").disabled = false;
        }
    },

    canvasSelectingPoints: e => {
        store.point = store.state.warper.touchStart(e)
        document.getElementById(`s2`).innerHTML = store.state.stage.panel(1)
    },


    canvasDragingPoints: e => {
        store.state.warper.touchDrag(e)
    },

    canvasDragingEnd: e => {
        store.state.warper.touchEnd(e)
    },

    canvasSelectPoint: e => {
        store.selectedPoint = store.state.warper.currentPointIndex
        document.getElementById(`s3`).innerHTML = store.state.stage.panel(1)
    },

    set selectedPoint(p) {
        this.state.selectedPoint = p
        document.getElementById("nextStage-button").disabled = false
    },

    set warper(w) {

        // canvas.removeEventListener("mousemove", (e) => warper.touchDrag(e));
        // this.state.canvas.removeEventListener("click", this.canvasClick);


        // canvas.removeEventListener("mouseup", (e) => warper.touchEnd(e));
        // canvas.addEventListener("mousemove", (e) => warper.touchDrag(e));
        // canvas.addEventListener("mousedown", (e) => {
        //     warper.touchStart(e)
        //     selectedPoint = warper.selectedPoint
        // });
        // canvas.addEventListener("mouseup", (e) => warper.touchEnd(e));
    },

    set file({ f, t }) {
        if (f) {
            this.state.handleFile({ f, t })
            document.getElementById(`s${this.state.stage.current}`).innerHTML = store.state.stage.panel(1)
        }
    },


    set views(v) {
        this.state.stage.views = v
    }
}