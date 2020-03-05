const gestures = {
    UP: "up",
    DOWN: "down",
    LEFT: "left",
    RIGHT: "right",
};


export default class ShifterEvent {

    constructor(){

        this.type = "";
        this.target = null;
        this.currentTarget = null;
        this.clientX = 0;
        this.clientY = 0;
        this.layerX = 0;
        this.layerY = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.pageX = 0;
        this.pageY = 0;

        this.duration = 0;
        this.gesture = "";

    }

    static get Gestures() {
        return gestures;
    }

}

