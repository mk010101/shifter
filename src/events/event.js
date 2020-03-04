export default class Event {


    constructor(target, evt) {

        this._target = target;
        this.name = "event"

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