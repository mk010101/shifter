class Dispatcher {

    constructor() {
        this._listeners = {};
    }




    on(evtName, listener) {

        if (! this._listeners[evtName]) this._listeners[evtName] = [];
        if (this._listeners[evtName].indexOf(listener) === -1) {
            this._listeners[evtName].push(listener);
        }
        return this;
    }

    off(evtName, listener) {

        if (this._listeners[evtName]) {
            let index = this._listeners[evtName].indexOf(listener);
            if (index > -1) this._listeners[evtName] = this._listeners[evtName].splice(index, 1);
        }
        return this;
    }

    offAll() {
        for (let p in this._listeners) {
            this._listeners[p] = [];
        }
    }

    dispatch(evtName, data) {

        if (!this._listeners[evtName]) return;

        for (let i = 0; i < this._listeners[evtName].length; i++) {
            this._listeners[evtName][i](data);
        }

    }

}

class Shifter extends Dispatcher {

    /**
     *
     * @param target HtmlElement to manipulate
     * @param funcs Array of Shifter.Func - manipulator functions
     */
    constructor(target, funcs) {

        super();


        this._target = target;
        this._gestures = [];
        this._disabled = false;

        // Target transforms -------------
        this._targetX = 0;
        this._targetY = 0;
        this._targetX0 = 0;
        this._targetY0 = 0;
        this._targetScale = 1;
        // -------------------------------

        // Pointer distance ---------------

        this._pointerXstart = 0;
        this._pointerYstart = 0;
        this._pointerXend = 0;
        this._pointerYend = 0;

        this._pinchDist0 = 0;

        // -------------------------------


        this._movesStack = [];

        this._pointerMovedX = 0;
        this._pointerMovedY = 0;
        this._gestureStrartTime = 0;
        this._gestureDuration = 0;

        this._zoomSpeed = 0.025;
        this._minZoom = .5;
        this._maxZoom = 2;
        this._detectPanDist = 5;

        this._speedX0 = 0;
        this._speedY0 = 0;
        this._speedX = 0;
        this._speedY = 0;

        this._panX0 = 0;
        this._panY0 = 0;
        this._isPanningX = false;

        this._isPassiveEvt = true;

        this._pointers = [];


        // CSS
        this._cssNoScroll = "__Shifter__no-scroll_2019-15";


        this._init(funcs);


    }

    _init(funcs) {

        for (let i = 0; i < funcs.length; i++) {
            let funcStr = funcs[i];
            if (this[funcStr]) {
                this._gestures.push(funcStr);
            }

            if (funcStr === Shifter.Func.ZOOM) {
                this._wheelZoom = this._wheelZoom.bind(this);
                this._target.addEventListener("wheel", this._wheelZoom);
            }
        }


        if ("PointerEvent" in window) {

            this._pointerDown = this._pointerDown.bind(this);
            this._pointerMove = this._pointerMove.bind(this);
            this._pointerUp = this._pointerUp.bind(this);
            this._pointerCancelled = this._pointerCancelled.bind(this);
            this._dispatchEnd = this._dispatchEnd.bind(this);

            this._target.addEventListener("pointerdown", this._pointerDown);
            window.addEventListener("pointerup", this._pointerUp);
            window.addEventListener("pointercancel", this._pointerCancelled);
            //window.addEventListener("pointerout", (e)=> {console.log("out")}, {passive: this._isPassiveEvt});

        } else {
            throw ("Pointer events are not supported on your device.");
        }


        this._addCSS();

    }


    get speedX() {
        return this._speedX;
    }

    get speedY() {
        return this._speedY;
    }

    get gestureDuration() {
        return this._gestureDuration;
    }

    get targetX() {
        return this._targetX;
    }

    get targetY() {
        return this._targetY;
    }

    get targetScale() {
        return this._targetScale;
    }

    get disabled() {
        return this._disabled;
    }

    set disabled(bool) {
        this._disabled = bool;
    }

    set minZoom(value) {
        this._minZoom = value;
    }

    set maxZoom(value) {
        this._maxZoom = value;
    }

    set zoomSpeed(value) {
        this._zoomSpeed = value;
    }

    updateTransforms() {
        this._setTransforms();
    }

    remove(keepCSS = true) {

        this._target.removeEventListener("wheel", this._wheelZoom);
        this._target.removeEventListener("pointermove", this._pointerMove);
        this._target.removeEventListener("pointerdown", this._pointerDown);
        window.removeEventListener("pointerup", this._pointerUp);
        this._unlockScroll();
        this._target = null;
        this.offAll();

        if (!keepCSS) this._removeCSS();

    }

    /* =================================================================================================================
        PRIVATE
     =================================================================================================================*/


    _pointerDown(e) {

        if (this._disabled) return;

        this._movesStack = [];

        this._speedX = 0;
        this._speedY = 0;
        this._minMovedDist = 10;

        if (this._disabled) return;

        let clientX = e.clientX;
        let clientY = e.clientY;

        this._pointerMovedX = clientX;
        this._pointerMovedY = clientY;

        this._setTransforms();

        this._speedX0 = clientX;
        this._speedY0 = clientY;

        this._panX0 = clientX - this._targetX;
        this._panY0 = clientY - this._targetY;
        //this._movesStack.push({x:this._panX0, y:this._panY0});

        //this._target.setPointerCapture(e.pointerId);
        this._pointers.push(e);

        this._gestureStrartTime = Date.now();

        this._target.addEventListener("pointermove", this._pointerMove, {passive: this._isPassiveEvt});
        this.dispatch(Shifter.Evt.START, e);

    }


    _pointerMove(e) {
        if (this._disabled) return;


        let clientX = e.clientX;
        let clientY = e.clientY;



        this._movesStack.push({vx: clientX - this._speedX0, vy: clientY - this._speedY0});
        if (this._movesStack.length > 10) {
            this._movesStack.shift();
        }



        for (let i = 0; i < this._gestures.length; i++) {
            this[this._gestures[i]](e);
        }

        this.dispatch(Shifter.Evt.MOVE, e);
        this._speedX0 = clientX;
        this._speedY0 = clientY;


    }


    _pointerUp(e) {
        if (this._disabled) return;

        for (let i = this._pointers.length - 1; i >= 0; i--) {

            if (e.pointerId === this._pointers[i].pointerId) {
                this._pointers.splice(i, 1);
            }
        }

        this._gestureDuration = Date.now() - this._gestureStrartTime;

        this._removeMoveListeners();
        this._unlockScroll();


        let speed = Shifter._getAvgSpeed(this._movesStack);

        this._speedX = speed.vx;
        this._speedY = speed.vy;
        //console.log(this._speedX, this._movesStack.length);


        this._dispatchEnd(e);

        if (this._listeners[Shifter.Evt.CLICK] && this._checkClick(e)) {
            this.dispatch(Shifter.Evt.CLICK, e);
        }

        if (this._listeners[Shifter.Evt.PAN_END] && this._checkPanned(e)) {
            this.dispatch(Shifter.Evt.PAN_END, e);
        }

        if (this._listeners[Shifter.Evt.PAN_X_END] && this._checkPannedX(e)) {
            this.dispatch(Shifter.Evt.PAN_X_END, e);
            //console.log("pan x end")
        }

        //console.log("-------")
    }

    static _getAvgSpeed(arr) {

        let vx = 0;
        let vy = 0;

        for (let i = 0; i <arr.length; i++) {
            vx += arr[i].vx;
            vy += arr[i].vy;
        }

        return {
            vx: vx / arr.length,
            vy: vy / arr.length,
        }
    }



    _pointerCancelled(e) {
        this._pointers = [];
        this.dispatch(Shifter.Evt.CANCELLED, e);
    }

    _checkClick(e) {

        if (this._gestureDuration > 300) return false;

        let x = e.clientX;
        let y = e.clientY;
        let dist = Math.sqrt((x - this._pointerMovedX) * (x - this._pointerMovedX) + (y - this._pointerMovedY) * (y - this._pointerMovedY));
        return (dist < this._minMovedDist);
    }

    _checkPanned(e) {
        return (this._targetX0 !== this._targetX || this._targetY0 !== this._targetY);
    }

    _checkPannedX(e) {
        return this._targetX0 !== this._targetX;
    }

    _removeMoveListeners() {
        this._target.removeEventListener("pointermove", this._pointerMove);
        this._isPanningX = false;
    }

    _dispatchEnd(e) {
        this.dispatch(Shifter.Evt.UP, e);
    }

    _setTransforms() {
        let str = this._target.style.transform;
        let arr = str.split(/\s+/gmi);
        for (let i = 0; i < arr.length; i++) {
            let m = arr[i].match(/([a-z]+)|([0-9-.]+)/gim);
            if (m) {
                if (m[0] === "scaleX") this._targetScale = parseFloat(m[1]);
                if (m[0] === "translateX") this._targetX = parseFloat(m[1]);
                if (m[0] === "translateY") this._targetY = parseFloat(m[1]);

                this._targetX0 = this._targetX;
                this._targetY0 = this._targetY;
            }
        }
    }


    /* =================================================================================================================
           MANIPULATORS
     =================================================================================================================*/

    /**
     * Pans target on x-Axes. Uses transform.
     * @param e {Event} Event (touch or mouse)
     */
    _panX(e) {


        if (this._pointers.length > 1) {
            e.preventDefault();
            return;
        }


        let x = e.clientX - this._panX0;
        let y = e.clientY - this._panY0;


        if (!this._isPanningX) {

            let xa = Math.abs(x - this._targetX);
            let ya = Math.abs(y);

            if (ya > this._detectPanDist && ya * 2 > xa) {
                this._removeMoveListeners();
            } else if (xa > this._detectPanDist && xa > ya * 2) {
                this._isPanningX = true;
                this._lockScroll();
                this.dispatch(Shifter.Evt.PAN_X_START, e);
            }
        } else {
            this._targetX = x;
            this._applyTransforms();
            this.dispatch(Shifter.Evt.PAN_X_PROGRESS, e);
        }

    }

    /**
     * Pans target on x- and y- Axes. Uses transform.
     * @param e {Event} Event (touch or mouse)
     */
    _pan(e) {

        if (this._pointers.length > 1) {
            e.preventDefault();
            return;
        }


        let x = e.clientX - this._panX0;
        let y = e.clientY - this._panY0;

        this._targetX = x;
        this._targetY = y;
        this._applyTransforms();

    }

    /**
     * Zooms target. Uses transform.
     * @param e {Event} Event (touch or mouse)
     */
    _zoom(e) {

        if (this._pointers.length === 2) {

            for (let i = 0; i < this._pointers.length; i++) {
                if (e.pointerId === this._pointers[i].pointerId) {
                    this._pointers[i] = e;
                    break;
                }
            }

            let x0 = this._pointers[0].clientX;
            let x1 = this._pointers[1].clientX;
            let y0 = this._pointers[0].clientY;
            let y1 = this._pointers[1].clientY;
            let dist = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));

            if (dist > this._pinchDist0 && this._targetScale <= this._maxZoom) {
                this._targetScale += this._zoomSpeed;
            } else if (dist < this._pinchDist0 && this._targetScale >= this._minZoom) {
                this._targetScale -= this._zoomSpeed;
            }
            this._pinchDist0 = dist;
            this._applyTransforms();
        }

    }

    _wheelZoom(e) {

        this._targetScale += e.deltaY * -0.001;
        this._targetScale = Math.min(Math.max(this._minZoom, this._targetScale), this._maxZoom);
        this._applyTransforms();
    }


    _applyTransforms() {
        this._target.style.transform = `
        translateX(${this._targetX}px) translateY(${this._targetY}px) 
        scaleX(${this._targetScale}) scaleY(${this._targetScale})`;
    }


    _addCSS() {

        let existingNoScroll = document.getElementById(this._cssNoScroll);
        if (!existingNoScroll) {
            let style = document.createElement('style');
            style.id = this._cssNoScroll;
            style.innerHTML = `.${this._cssNoScroll} * { overflow: hidden; }`;
            document.getElementsByTagName('head')[0].appendChild(style);
        }
    }

    _removeCSS() {

        let existingNoScroll = document.getElementById(this._cssNoScroll);
        if (existingNoScroll) {
            document.getElementsByTagName('head')[0].removeChild(existingNoScroll);
        }
    }

    _lockScroll() {
        this._target.classList.add(this._cssNoScroll);
    }

    _unlockScroll() {
        this._target.classList.remove(this._cssNoScroll);
    }


}

Shifter.Func = {
    PAN_X: "_panX",
    PAN: "_pan",
    ZOOM: "_zoom",

};

Shifter.Evt = {
    PAN_X_START: "panXStart",
    PAN_X_PROGRESS: "panXProgress",
    PAN_X_END: "panXEnd",
    PAN_START: "panStart",
    PAN_PROGRESS: "panProgress",
    PAN_END: "panEnd",
    START: "start",
    MOVE: "move",
    UP: "up",
    CANCELLED: "cancelled",
    CLICK: "click",
};

Object.freeze(Shifter.Evt);
Object.freeze(Shifter.Func);

/*
CSS properties:

    userSelect: "none",
    webkitTouchCallout: "none",
    userDrag: "none",
    touchAction: "none"

 */

export default Shifter;
export { Shifter };
