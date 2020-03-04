import Event from "./event.js"

export default class Click extends Event {


    constructor(target, evt) {

        super(target);
        this._target = target;

    }


    onDown(e) {

    }

    onMove(e) {

    }

    onUp(e){

    }

    onCancelled(e) {
        this._pointers = [];
    }

    onWheel(e) {

    }


    destroy() {
        this._target = null;
    }


}