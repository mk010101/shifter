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
    }

    static get Gestures() {
        return gestures;
    }

}

