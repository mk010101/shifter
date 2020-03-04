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

class Action {


    constructor(target, transforms) {

        this._target = target;
        this.transforms = transforms;
        this._pointers = [];
    }


    onDown(e) {
        this._pointers.push(e);
    }

    onMove(e) {

    }

    onUp(e){

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

// 4, 5
class Pan extends Action {

    constructor(target, transforms) {

        super(target, transforms);
        this._x0 = transforms[4];
        this._y0 = transforms[5];

    }


    onDown(e) {
        super.onDown(e);
        this._x0 = e.clientX - this.transforms[4];
        this._y0 = e.clientY - this.transforms[5];
    }


    onMove(e) {

        if (this._pointers.length > 1) {
            e.preventDefault();
            return;
        }


        let x = e.clientX - this._x0;
        let y = e.clientY - this._y0;
        this.transforms[4] = x;
        this.transforms[5] = y;
    }


}

// [4, (5)]

class Pan_X extends Action {

    constructor(target, transforms) {

        super(target, transforms);

        this._detectPanDist = 10;
        this._isPanningX = false;
        this._canPan = true;
        this._panX0 = 0;
        this._panY0 = 0;
    }


    onDown(e) {
        super.onDown(e);
        this._panX0 = e.clientX - this.transforms[4];
        this._panY0 = e.clientY - this.transforms[5];
        this._canPan = true;
    }


    onMove(e) {


        if (this._pointers.length > 1 || !this._canPan) {
            e.preventDefault();
            return;
        }


        let x = e.clientX - this._panX0;
        let y = e.clientY - this._panY0;


        if (!this._isPanningX) {

            let xa = Math.abs(x - this.transforms[4]);
            let ya = Math.abs(y);

            if (ya > this._detectPanDist && ya * 2 > xa) {
                this._canPan = false;
            } else if (xa > this._detectPanDist && xa > ya * 2) {
                this._isPanningX = true;
                this._lockScroll();

                //this.dispatch(Shifter.Evt.PAN_X_START, e);
            }
        } else {
            this.transforms[4] = x;
            //this.dispatch(Shifter.Evt.PAN_X_PROGRESS, e);
        }



    }

    onUp(e) {
        super.onUp(e);
        this._isPanningX = false;
    }

    _lockScroll() {

    }


}

class Zoom extends Action {

    //0, 3
    constructor(target, transforms) {

        super(target, transforms);
        this._minZoom = .3;
        this._maxZoom = 3;
        this._pinchDist0 = 0;
        this._zoomSpeed = 0.025;
        this._scale = transforms[0];
    }


    onDown(e) {
        super.onDown(e);
    }


    onMove(e) {


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

            if (dist > this._pinchDist0 && this._scale <= this._maxZoom) {
                this._scale += this._zoomSpeed;
            } else if (dist < this._pinchDist0 && this._scale >= this._minZoom) {
                this._scale -= this._zoomSpeed;
            }
            this._pinchDist0 = dist;
            this.transforms[0] = this._scale;
            this.transforms[3] = this._scale;

        }

    }

    onWheel(e) {
        this._scale += e.deltaY * -0.001;
        this._scale = Math.min(Math.max(this._minZoom, this._scale), this._maxZoom);
        this.transforms[0] = this._scale;
        this.transforms[3] = this._scale;
    }


}

class Event {


    constructor(target, evt) {

        this._target = target;
        this.name = "event";

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

class Click extends Event {


    constructor(target, evt) {

        super(target);
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
            console.log("CLICK");
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

/**
 * Takes a CSS 2D transform matrix and returns an array of values:
 * matrix( scaleX(), skewY(), skewX(), scaleY(), translateX(), translateY() )
 * @param str 2d transform matrix string
 * @returns {Array}
 */
function splitTransformMatrix(str) {

    let res = str.match(/[-0-9.]+/gi);
    if (res) {
        res = res.map(v => parseFloat(v));
    } else res = [1, 0, 0, 1, 0, 0];
    return res;
}

class Shifter extends Dispatcher {


    constructor(target, funcs) {
        super();

        this.Evt = {
            target: null,
            distX: 0,
            distY: 0,
            dist: 0,
            duration: 0,
            speedX: 0,
            speedY: 0,
            speed: 0
        };

        this._target = target;
        this._funcs = [];
        this._gestures = [];
        this._events = [];
        this._disabled = false;
        this._isPassiveEvt = true;

        this._init(funcs);

    }

    on(event, listener) {

        this._events.push(new event(this.target));
    }


    _init(funcs) {

        if (!"PointerEvent" in window) throw ("Pointer events are not supported on your device.");

        this._pDown = this._pDown.bind(this);
        this._pMove = this._pMove.bind(this);
        this._pUp = this._pUp.bind(this);
        this._pCancelled = this._pCancelled.bind(this);
        this._onWheel = this._onWheel.bind(this);
        this._dispatchEnd = this._dispatchEnd.bind(this);

        this._target.addEventListener("pointerdown", this._pDown);
        window.addEventListener("pointerup", this._pUp);
        window.addEventListener("pointercancel", this._pCancelled);


        let transforms = this._parseTargetTransforms();

        for (let i = 0; i < funcs.length; i++) {
            this._funcs.push(new funcs[i](this._target, transforms));
            if (funcs[i] === Zoom) {
                this._target.addEventListener("wheel", this._onWheel);
            }
        }
        this._setTransforms();


    }


    _pDown(e) {

        for (let i = 0; i < this._funcs.length; i++) {
            this._funcs[i].onDown(e);
        }

        for (let i = 0; i < this._events.length; i++) {
            this._events[i].onDown(e);
        }

        this._target.addEventListener("pointermove", this._pMove, {passive: this._isPassiveEvt});

    }


    _pMove(e) {

        for (let i = 0; i < this._funcs.length; i++) {
            this._funcs[i].onMove(e);
        }

        for (let i = 0; i < this._events.length; i++) {
            this._events[i].onMove(e);
        }

        this._setTransforms();
    }


    _pUp(e) {

        for (let i = 0; i < this._funcs.length; i++) {
            this._funcs[i].onUp(e);
        }

        for (let i = 0; i < this._events.length; i++) {
            this._events[i].onUp(e);
        }

        this._target.removeEventListener("pointermove", this._pMove);
    }


    _pCancelled(e) {
        for (let i = 0; i < this._funcs.length; i++) {
            this._funcs[i].onCancelled(e);
        }
        this._target.removeEventListener("pointermove", this._pMove);
    }

    _onWheel(e) {
        for (let i = 0; i < this._funcs.length; i++) {
            this._funcs[i].onWheel(e);
        }
        this._setTransforms();
    }


    _dispatchEnd(e) {

    }

    /*
        matrix( scaleX(), skewY(), skewX(), scaleY(), translateX(), translateY() )
     */

    _setTransforms() {
        if (this._funcs.length > 0) {
            this._target.style.transform = `matrix(
            ${this._funcs[0].transforms[0] || 1}, 
            ${this._funcs[0].transforms[1] || 0}, 
            ${this._funcs[0].transforms[2] || 0}, 
            ${this._funcs[0].transforms[3] || 1},  
            ${this._funcs[0].transforms[4] || 0}, 
            ${this._funcs[0].transforms[5] || 0})`;
        }
    };


    _parseTargetTransforms() {
        let str = window.getComputedStyle(this._target).transform;
        return splitTransformMatrix(str);
    }


}


Shifter.Func = {
    PAN_X: Pan_X,
    PAN: Pan,
    ZOOM: Zoom,

};

Shifter.Evt = {
    //PAN_X_START: "panXStart",
    //PAN_X_PROGRESS: "panXProgress",
    //PAN_X_END: "panXEnd",
    //PAN_START: "panStart",
    //PAN_PROGRESS: "panProgress",
    //PAN_END: "panEnd",
    //START: "start",
    //MOVE: "move",
    //UP: "up",
    //CANCELLED: "cancelled",
    CLICK: Click,
};

Object.freeze(Shifter.Evt);
Object.freeze(Shifter.Func);

export default Shifter;
export { Shifter };
