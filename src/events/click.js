import Event from "./event.js"

export default class Click extends Event {


    constructor(target, evt) {

        super(target);
        this.type = "click";
        this._maxMoved = 15;
        this._gestureStrartTime = 0;
        this._x0 = 0;
        this._y0 = 0;

    }


    onDown(e) {
        this._gestureStrartTime = Date.now();
        this._x0 = e.clientX;
        this._y0 = e.clientY;
    }

    onMove(e) {

    }

    onUp(e){

        if (Date.now() - this._gestureStrartTime > 300) return;

        let x = e.clientX;
        let y = e.clientY;
        let dist = Math.sqrt((x - this._x0) * (x - this._x0) + (y - this._y0) * (y - this._y0));
        if (dist < this._maxMoved) {
            this._target.dispatch(this.type, e)
        }
    }

    onCancelled(e) {

    }

    onWheel(e) {

    }


    destroy() {
        this._target = null;
    }


}