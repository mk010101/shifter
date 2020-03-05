const gestures = {
    SWIPE_UP: "swipe_up",
    SWIPE_DOWN: "swipe_down",
    SWIPE_LEFT: "swipe_left",
    SWIPE_RIGHT: "swipe_right",
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
        this.velocityX = 0;
        this.velocityY = 0;

    }

    static get Gestures() {
        return gestures;
    }

}

