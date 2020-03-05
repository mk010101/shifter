import Recognizer from "../recognizers/recognizer.js";

export default class Action extends Recognizer {


    constructor(target, transforms) {

        super(target);
        this._target = target;
        this.transforms = transforms;
        this._pointers = [];
    }


    onDown(e) {
        super.onDown(e);
        this._pointers.push(e);
    }

    onMove(e) {

    }

    onUp(e){

        super.onUp(e);
        for (let i = this._pointers.length - 1; i >= 0; i--) {

            if (e.pointerId === this._pointers[i].pointerId) {
                this._pointers.splice(i, 1);
            }
        }
    }

    onCancelled(e) {
        this._pointers = [];
    }

    onWheel(e) {

    }


    destroy() {
        this.transforms = [];
        this._target = null;
        this._pointers = [];
    }


}