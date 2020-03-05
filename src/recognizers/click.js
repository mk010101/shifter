import Recognizer from "./recognizer.js"

export default class Click extends Recognizer {


    constructor(target) {

        super(target);
        this.type = "click";
        this._maxMoved = 15;
        this._x0 = 0;
        this._y0 = 0;

    }


    onDown(e) {
        super.onDown(e);
        this._x0 = e.clientX;
        this._y0 = e.clientY;
    }

    onMove(e) {

    }

    onUp(e){

        super.onUp(e);

        if (this.dur > 300) return;

        let x = e.clientX;
        let y = e.clientY;
        let dist = Math.sqrt((x - this._x0) * (x - this._x0) + (y - this._y0) * (y - this._y0));
        if (dist < this._maxMoved) {
            this.setEvt(e);
            this.evt.type = this.type;
            this._target.dispatch(this.type, this.evt);
            console.log(e)
        }
    }


}