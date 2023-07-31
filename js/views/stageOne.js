
const stageOne = {
    view() {
        return `
                <div id="stage-1" class="p-2">
                    <div class="head position-relative">
                        <h4>${store.state.languages[store.state.lang][31].heading}</h4>

                        <p id="desc" class="text-white">${store.state.languages[store.state.lang][31].desc}</p>
                    </div>
                    <div class="d-flex justify-content-center" id="result">
                        <canvas></canvas>
                    </div>

                    <div class="d-grid gap-2 mt-2">
                        <input accept=".jpg,.jpeg,.png" type="file" data-type="image" id="picture" class="d-none"/>
                        <button id="upload-picture" class="btn btn-primary color-pink">${store.state.languages[store.state.lang][31].upload}</button>
                    </div>
                </div>
`
    },

    state: {
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
                        document.getElementById(`s1`).innerHTML = store.state.stage.panel(1, 1)
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
                if (callback instanceof Function) {
                    const imgData = ctx.getImageData(0, 0, image.width, image.height)
                    callback(imgData);

                    // const data = imgData.data
                    // for (let i = 0; i < data.length; i += 4) {
                    //     if (data[i + 3] < 255) {
                    //         data[i] = 255;
                    //         data[i + 1] = 0;
                    //         data[i + 2] = 0;
                    //         data[i + 3] = 255;
                    //     }
                    // }

                    // ctx.putImageData(imgData, 0, 0)
                }
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
            const button = document.getElementById("upload-picture")
            button.removeEventListener("click", this.uploadPicture)
            document.getElementById("desc").innerHTML = store.state.languages[store.state.lang][31].uploaded
            button.id = "nextStage-button"
            button.innerHTML = store.state.languages[store.state.lang].nextStage
            button.addEventListener("click", store.state.stage.nextStage)
        },
    }
}