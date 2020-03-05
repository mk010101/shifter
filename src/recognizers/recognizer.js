import ShifterEvent from "./../evt/shifterevent.js";

export default class Recognizer {


    constructor(target) {

        this._target = target;
        this.type = "event";
        this.evt = new ShifterEvent();
        this.dur = 0;
        this.startTime = 0;

        this.canDispatch = false;
        this.evtData = null;
    }


    onDown(e) {
        this.startTime = Date.now();
    }

    onMove(e) {

    }

    onUp(e){
        this.duration = Date.now() - this.startTime;
    }

    onCancelled(e) {
        this.duration = Date.now() - this.startTime;
    }

    onWheel(e) {

    }


    destroy() {
        this._target = null;
    }

    setEvt(e) {
        this.evt.duration = this.duration;

        this.evt.target = e.target;
        this.evt.currentTarget = e.currentTarget;
        this.evt.clientX = e.clientX;
        this.evt.clientY = e.clientY;
        this.evt.layerX = e.layerX;
        this.evt.layerY = e.layerY;
        this.evt.offsetX = e.offsetX;
        this.evt.offsetY = e.offsetY;
        this.evt.pageX = e.pageX;
        this.evt.pageY = e.pageY;

    }

}