const config = {
    frameRate: 30,
    autoRender: true,

    set changeState({field, element, value}) {
        if(this.hasOwnProperty(field)) {
            this[field] = value ?? element.value;
            if(element && element.nextElementSibling?.value)
                element.nextElementSibling.value=element.value
        }
    }
}