export default class Event {


    constructor(target, shifter) {

        this._target = target;
        this.type = "event"

    }


    onDown(e) {

    }

    onMove(e) {

    }

    onUp(e){

    }

    onCancelled(e) {

    }

    onWheel(e) {

    }


    destroy() {
        this._target = null;
    }


}