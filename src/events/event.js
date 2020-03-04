export default class Event {


    constructor(target, evt) {

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