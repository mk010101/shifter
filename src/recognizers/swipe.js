import Recognizer from "./recognizer.js"
import ShifterEvent from "../evt/shifterevent";


function getAvgSpeed(arr) {

    let vx = 0;
    let vy = 0;

    for (let i = 0; i < arr.length; i++) {
        vx += arr[i].vx;
        vy += arr[i].vy;
    }

    return {
        vx: vx / arr.length,
        vy: vy / arr.length,
    }
}

export default class Swipe extends Recognizer {


    constructor(target) {

        super(target);
        this.type = "swipe";
        this.evt.type = this.type;
        this._swipeSpeed = 5;
        this._movesStack = [];
        this._x0 = 0;
        this._y0 = 0;

    }


    onDown(e) {
        super.onDown(e);
        this._movesStack = [];
        this._x0 = e.clientX;
        this._y0 = e.clientY;
    }

    onMove(e) {


        this._movesStack.push({vx: e.clientX - this._x0, vy: e.clientY - this._y0});
        if (this._movesStack.length > 10) {
            this._movesStack.shift();
        }
        this._x0 = e.clientX;
        this._y0 = e.clientY;
    }

    onUp(e) {

        super.onUp(e);
        if(this._movesStack.length === 0) return;
        let {vx, vy} = getAvgSpeed(this._movesStack);
        let absVx = Math.abs(vx);
        let absVy = Math.abs(vy);

        if (Math.abs(vx) < this._swipeSpeed && Math.abs(vy) < this._swipeSpeed) return;

        if (absVx > absVy * 2) {
            //console.log(vx)
            this.setEvt(e);
            if (vx < 0) {
                this.evt.gesture = ShifterEvent.Gestures.SWIPE_LEFT;
            } else {
                this.evt.gesture = ShifterEvent.Gestures.SWIPE_RIGHT;
            }
            //this._target.dispatch(this.type, this.evt);
        } else if (absVx < absVy * 2) {
            //console.log(vx)
            this.setEvt(e);
            if (vy < 0) {
                this.evt.gesture = ShifterEvent.Gestures.SWIPE_UP;
            } else {
                this.evt.gesture = ShifterEvent.Gestures.SWIPE_DOWN;
            }
            //this._target.dispatch(this.type, this.evt);
        }

        this.evt.velocityX = vx;
        this.evt.velocityY = vy;
        this._target.dispatch(this.type, this.evt);

    }


}