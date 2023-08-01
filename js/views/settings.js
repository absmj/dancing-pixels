const settings = () => {
    const curLang = store.state.languages[store.state.lang]
    return `
    <!-- Settings -->
          <div class="ps-2 d-block">
              <div class="header">
                  <h5 class="title" id="setting-title">${curLang.settings}</h5>
              </div>
              <div class="body">
                <fieldset>
                    <div class="form-check form-switch d-flex justify-content-between p-0">
                        <label class="form-check-label" for="auto-render">${curLang.autoRender}</label>
                        <input onchange="config.changeState = {field: 'autoRender', value: this.checked}" class="form-check-input" type="checkbox" ${config.autoRender && 'checked'} role="switch" id="auto-render">
                    </div>
                    <hr>
                    <div class="form-check p-0">
                        <label for="framerate-range" class="form-label">${curLang.frameRate}</label>
                        <input oninput="config.changeState={field: 'frameRate', element: this}" type="range" class="form-range" min="12" value=${config.frameRate} max="60" step="1" id="framerate-range">
                        <output for="framerate-range">${config.frameRate}</output>
                    </div>
                </fieldset>
              </div>
          </div>
    
    `
}