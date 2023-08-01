const max = 128, min = 0;
let mediaRecorder;
let easing = 1, xE = 1, yE = 1;

const stageFour = {
    view() {
        return `
        <div id="stage-4" class="p-2">
            <div class="head position-relative">
                <h4 id="head">${store.state.languages[store.state.lang][34].heading}</h4>
                <div  id="record" class="d-none"></div>
                <p id="desc" class="text-white">${store.state.languages[store.state.lang][34].desc}</p>
            </div>
            <div class="d-flex justify-content-center" id="result">
            </div>

            <div class="d-grid gap-2 mt-2">
                <input type="file" data-type="audio" id="audio" accept=".mp3" class="d-none"/>
                <button id="upload-audio" class="btn btn-primary color-pink">${store.state.languages[store.state.lang][31].upload}</button>
            </div>
        </div>

        <div id="resulvideo" class="modal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 id="modal-title-download" class="modal-title"></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body d-flex justify-content-center">
                        <video id="video-result" controls></video>
                    </div>

                    <div class="modal-footer">
                        <a id="download-video" class="btn btn-primary">Download</a>
                    </div>
                </div>
            </div>
        </div>
            `
    },

    state: {
        id: 4,

        generate(frames) {
            let clientX = (frames[Math.floor(Math.random() * (max - min) + min)]);
            let clientY = (frames[Math.floor(Math.random() * (max - min) + min)]);
            let { x, y } = findOptimalCoordinates(store.state.warper.oriPoints, store.state.warper.selectedPoint,
                { x: clientX, y: clientY });
            // let targetX = x;
            // let dx = targetX - xE;
            // xE += dx * easing;

            // let targetY = y;
            // let dy = targetY - yE;
            // yE += dy * easing;

            const dst = store.state.warper.dstPoints;
            const p = new ImgWarper.Point(x, y)

            dst[store.state.selectedPoint] = p;
            store.state.warper.dstPoints[store.state.warper.currentPointIndex] = p;

            store.state.warper.imgWarper.warp(store.state.warper.oriPoints, dst)
            // store.state.canvas.style.transform = `translate(${p.x * 0.1}px, -${p.y * 0.1}px)`
            store.selectedPoint = p;
            // store.state.warper.redrawCanvas(dst)

        },

        handleFile(extension, fileContent, file) {
            if (["mp3"].includes(extension)) {
                fileContent.onload = () => {
                    this.render(fileContent.result, audioData => {
                        document.getElementById(`s4`).innerHTML = store.state.stage.panel(1, 4)
                        document.getElementById("record").classList.remove("d-none")
                        config.autoRender && document.getElementById("record").click();
                    })

                }
                fileContent.readAsDataURL(file)
                this.beforeDestroy()
            } else throw new Error("Unsupported file")
        },

        render(src, callback = null) {
            const audio = new Audio(src);
            store.state.audio = audio;
            store.state.audioData = analyser = new AudioAnalyzer(audio);
            analyser.analyzing();
            audio.addEventListener('canplaythrough', () => {
                store.state.audioData.initAudioStream();
                callback instanceof Function && callback();
            }, false);

            //  console.log
            audio.addEventListener("timeupdate", () => {
                const a = analyser.getFrame();
                this.generate(a, store.state.warper.oriPoints[store.state.selectedPoint])
            })

            audio.addEventListener("ended", () => {
                mediaRecorder.stop();
            })
        },

        uploadAudio() {
            const file = document.getElementById("audio")
            file.click()
        },

        beforeDestroy() {
            const button = document.getElementById("upload-audio")
            button.id = "resetState-button"
            button.innerHTML = store.state.languages[store.state.lang].resetState
            button.removeEventListener("click", this.uploadAudio)
            button.addEventListener("click", store.resetState)
        },

        saveCanvasAsVideo(e) {
            document.getElementById("record").removeEventListener("click", this.saveCanvasAsVideo)
            document.getElementById("head").innerHTML = store.state.languages[store.state.lang].rendering
            document.getElementById("desc").innerHTML = store.state.languages[store.state.lang].renderingDesc

            fn(e).then(async ({ url, blob }) => {
                const video = document.getElementById("video-result")
                const download = document.getElementById("download-video")
                document.getElementById("head").innerHTML = store.state.languages[store.state.lang].rendered
                document.getElementById("desc").innerHTML = store.state.languages[store.state.lang].renderedDesc
                e.target.classList.remove("recording")
                e.target.classList.add("download")
                e.target.setAttribute("data-bs-toggle", "modal")
                e.target.setAttribute("data-bs-target", "#resulvideo")
                const filename = `${store.state.file.image} (dancingpixel).webm`
                document.getElementById("modal-title-download").textContent = filename
                download.href = url
                download.download = filename;
                video.src = url
                // video.play();
            })

            function fn(e) {
                var recordedChunks = [];
                e.target.classList.add("recording")
                var time = 0;
                var canvas = store.state.canvas;
                var ctx = canvas.getContext("2d")
                return new Promise(function (res, rej) {


                    var stream = canvas.captureStream(config.frameRate);
                    mediaRecorder = new MediaRecorder(stream, {
                        mimeType: "video/webm; codecs=vp9"
                    });
                    stream.addTrack(store.state.audioData.aStream.getAudioTracks()[0]);

                    mediaRecorder.start(time);

                    mediaRecorder.ondataavailable = function (e) {
                        recordedChunks.push(e.data);
                    }

                    mediaRecorder.onstop = function (event) {
                        var blob = new Blob(recordedChunks, {
                            "type": "video/mp4"
                        });
                        var url = URL.createObjectURL(blob);
                        res({ url, blob }); // resolve both blob and url in an object
                    }
                });
            }
        },

        mount() {
            const button = document.getElementById("upload-audio")
            const file = document.getElementById("audio")
            const record = document.getElementById("record")
            record.addEventListener("click", this.saveCanvasAsVideo)
            button.addEventListener("click", this.uploadAudio)
            document.getElementById("result").append(store.state.canvas)
            // store.state.canvas.addEventListener("mousemove", (e) => store.state.warper.touchDrag(e));
            // document.getElementById("run").addEventListener("click", () => this.generate())
            file.addEventListener("change", (e) => store.file = { f: e.target, t: e.target.dataset.type });
        }
    }
}