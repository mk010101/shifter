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

    onWheel(e) {

    }

}

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
        this._disabled = false;
        this._isPassiveEvt = true;

        this._init(funcs);

    }


    _init(funcs) {

        if ("PointerEvent" in window) {

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

        } else {
            throw ("Pointer events are not supported on your device.");
        }


    }


    _pDown(e) {


        for (let i = 0; i < this._funcs.length; i++) {
            this._funcs[i].onDown(e);
        }
        this._target.addEventListener("pointermove", this._pMove, {passive: this._isPassiveEvt});

    }


    _pMove(e) {
        for (let i = 0; i < this._funcs.length; i++) {
            this._funcs[i].onMove(e);
        }
        this._setTransforms();
    }


    _pUp(e) {
        for (let i = 0; i < this._funcs.length; i++) {
            this._funcs[i].onUp(e);
        }
        this._target.removeEventListener("pointermove", this._pMove);
    }


    _pCancelled(e) {

    }

    _onWheel(e) {
        for (let i = 0; i < this._funcs.length; i++) {
            this._funcs[i].onWheel(e);
        }
        this._setTransforms();
    }


    _dispatchEnd(e) {

    }

    _setTransforms() {
        this._target.style.transform = `matrix(
        ${this._funcs[0].transforms[0] || 1}, 
        ${this._funcs[0].transforms[1] || 0}, 
        ${this._funcs[0].transforms[2] || 0}, 
        ${this._funcs[0].transforms[3] || 1},  
        ${this._funcs[0].transforms[4] || 0}, 
        ${this._funcs[0].transforms[5] || 0})`;
    };

    /*
        matrix( scaleX(), skewY(), skewX(), scaleY(), translateX(), translateY() )
     */

    _parseTargetTransforms() {
        let str = window.getComputedStyle(this._target).transform;
        return Shifter._splitMatrix(str);
    }

    static _splitMatrix(str) {

        let res = str.match(/[-0-9.]+/gi);
        if (res) {
            res = res.map(v => parseFloat(v));
        } else res = [1, 0, 0, 1, 0, 0];
        return res;
    }


}


Shifter.Func = {
    PAN_X: "_panX",
    PAN: Pan,
    ZOOM: Zoom,

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

export default Shifter;
export { Shifter };
