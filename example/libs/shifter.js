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

    updateTransforms(transforms) {
        this.transforms = transforms;
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
        this._x0 = 0;
    }


    onDown(e) {
        super.onDown(e);
        this._panX0 = e.clientX - this.transforms[4];
        this._panY0 = e.clientY - this.transforms[5];
        this._x0 = this.transforms[4];
        this._canPan = true;
    }


    onMove(e) {


        if (this._pointers.length > 1 || !this._canPan) {
            //e.preventDefault();
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
        /*
        if (this._x0 !== this.transforms[4] && this._isPanningX) {
            this.evt.type = "pan_x_end";
            this.setEvt(e);
            this._target.dispatch("pan_x_end", this.evt);
        }
        this._isPanningX = false;
         */
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

//import Recognizer from "./recognizers/recognizer";

class Recognizer {


    constructor(target) {

        this._target = target;
        this._initMatrix = "";
        this._movesStack = [];
        this._initTime = 0;
        this._velX0 = 0;
        this._velY0 = 0;
        this._velX1 = 0;
        this._velY1 = 0;
        this._pointerX0 = 0;
        this._pointerY0 = 0;
        this._isRunning = false;

        this.state = {
            duration: 0,
            velocityX: 0,
            velocityY: 0,
            targetTransformed: false,
            targetMoved: false,
            panX: 0,
            panY: 0,
            scaled: 1,
            pointerMovedX: 0,
            pointerMovedY: 0,
            pointerMovedDistance: 0,
        };

        this.tick = this.tick.bind(this);

    }


    onDown(e) {
        this._initTime = Date.now();
        this._movesStack = [];
        this._velX0 = e.clientX;
        this._velY0 = e.clientY;
        this._pointerX0 = e.clientX;
        this._pointerY0 = e.clientY;
        this._initMatrix = this._getMatrixString();
        this.state.targetTransformed = false;
        this.state.targetMoved = false;
        this.state.panX = 0;
        this.state.panY = 0;
        this.state.scaled = 0;
        this._isRunning = true;
        requestAnimationFrame(this.tick);
    }

    onMove(e) {

        this._velX1 = e.clientX;
        this._velY1 = e.clientY;


        //let {vx, vy} = getAvgSpeed(this._movesStack);
        //console.log(vx, vy)

    }

    tick() {

        this._movesStack.push({vx: this._velX1 - this._velX0, vy: this._velY1 - this._velY0});
        if (this._movesStack.length > 20) {
            this._movesStack.shift();
        }
        this._velX0 = this._velX1;
        this._velY0 = this._velY1;

        if (this._isRunning) requestAnimationFrame(this.tick);
    }


    onUp(e) {
        let {vx, vy} = getAvgSpeed(this._movesStack);

        this.state.duration = Date.now() - this._initTime;
        this.state.velocityX = vx || 0;
        this.state.velocityY = vy || 0;
        this._compareMtx();
        this._isRunning = false;

        this.state.pointerMovedX = e.clientX - this._pointerX0;
        this.state.pointerMovedY = e.clientY - this._pointerY0;
        this.state.pointerMovedDistance = Math.sqrt(this.state.pointerMovedX * this.state.pointerMovedX + this.state.pointerMovedY * this.state.pointerMovedY);
        //console.log(this.state)


    }

    onWheel(e) {
        this._compareMtx();
    }

    onCancelled(e) {
        this._isRunning = false;
    }

    /*
        matrix( scaleX(0), skewY(1), skewX(2), scaleY(3), translateX(4), translateY(5) )
     */

    _compareMtx() {
        let newMatrix = this._getMatrixString();

        if (this._initMatrix && this._initMatrix !== newMatrix) {
            this.state.targetTransformed = true;

            let t0 = splitTransformMatrix(this._initMatrix);
            let t1 = splitTransformMatrix(newMatrix);

            if (t0[4] !== t1[4]) {
                this.state.panX = t1[4] - t0[4];
                this.state.targetMoved = true;
            }

            if (t0[5] !== t1[5]) {
                this.state.panY = t1[5] - t0[5];
                this.state.targetMoved = true;
            }

            if (t0[0] !== t1[0]) this.state.scaled = t1[0] - t0[0];

        }
    }

    _getMatrixString() {
        return window.getComputedStyle(this._target).transform;
    }


}


function getAvgSpeed(arr) {

    let vx = 0;
    let vy = 0;

    for (let i = 0; i < arr.length; i++) {
        vx += arr[i].vx;
        vy += arr[i].vy;
    }

    return {
        vx: vx / arr.length,
        vy: vy / arr.length,
    }
}

const gestures = {
    SWIPE_UP: "swipe_up",
    SWIPE_DOWN: "swipe_down",
    SWIPE_LEFT: "swipe_left",
    SWIPE_RIGHT: "swipe_right",
};


class ShifterEvent {

    constructor(){

        this.type = "";
        this.target = null;
    }

    static get Gestures() {
        return gestures;
    }

}

const CssProps = {
    userSelect: "none",
    webkitTouchCallout: "none",
    webkitUserSelect: "none",
    userDrag: "none",
    touchAction: "none"
};

const params = {
    clickInvalidDistance: 5,

};


class Shifter extends Dispatcher {


    constructor(target, funcs = null, cssProps = null) {

        super();

        this._target = target;
        this._funcs = [];
        this._gestures = [];
        this._disabled = false;
        this._isPassiveEvt = true;
        this._prevTransforms = [];

        this._manager = new Recognizer(target);

        this._init(funcs);

    }


    _init(funcs) {

        if (!"PointerEvent" in window) throw ("Pointer events are not supported on your device.");

        this._pDown = this._pDown.bind(this);
        this._pMove = this._pMove.bind(this);
        this._pUp = this._pUp.bind(this);
        this._pCancelled = this._pCancelled.bind(this);
        this._onWheel = this._onWheel.bind(this);
        //this._dispatchEnd = this._dispatchEnd.bind(this);

        this._target.addEventListener("pointerdown", this._pDown);
        window.addEventListener("pointerup", this._pUp);
        window.addEventListener("pointercancel", this._pCancelled);


        let transforms = this._parseTargetTransforms();

        for (let i = 0; i < funcs.length; i++) {
            this._funcs.push(new funcs[i](this, transforms));
            if (funcs[i] === Zoom) {
                this._target.addEventListener("wheel", this._onWheel);
            }
        }

        const keys = Object.keys(CssProps);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            this._target.style[key] = CssProps[key];
            //console.log(key, ke)
        }


        this._setTransforms();


    }


    _pDown(e) {

        let tr = this._parseTargetTransforms();

        for (let i = 0; i < this._funcs.length; i++) {
            this._funcs[i].updateTransforms(tr);
            this._funcs[i].onDown(e);
        }

        if (this._funcs.length > 0) ;

        this._manager.onDown(e);

        this._target.addEventListener("pointermove", this._pMove, {passive: this._isPassiveEvt});

    }


    _pMove(e) {

        for (let i = 0; i < this._funcs.length; i++) {
            this._funcs[i].onMove(e);
        }
        this._setTransforms();

        this._manager.onMove(e);

    }


    _pUp(e) {

        for (let i = 0; i < this._funcs.length; i++) {
            this._funcs[i].onUp(e);
        }

        this._manager.onUp(e);

        this._target.removeEventListener("pointermove", this._pMove);


        this._sendEvt(Shifter.Evt.UP);

        if (this._manager.state.targetMoved) this._sendEvt(Shifter.Evt.TARGET_MOVED);

        let clickListeners = this._listeners[Shifter.Evt.CLICK];
        if (clickListeners && clickListeners.length > 0) {
            let t = this._manager.state.duration;
            let dist = this._manager.state.pointerMovedDistance;
            if (t < 300 && dist < params.clickInvalidDistance) {
                this._sendEvt(Shifter.Evt.CLICK);
            }
        }

    }


    _pCancelled(e) {

        this._manager.onCancelled(e);

        for (let i = 0; i < this._funcs.length; i++) {
            this._funcs[i].onCancelled(e);
        }

        this._target.removeEventListener("pointermove", this._pMove);

        this._sendEvt(Shifter.Evt.CANCELLED);

    }

    _onWheel(e) {

        this._manager.onWheel(e);

        for (let i = 0; i < this._funcs.length; i++) {
            this._funcs[i].onWheel(e);
        }
        this._setTransforms();
    }


    _dispatchEnd(e) {

    }

    _sendEvt(type) {

        if (this._listeners[type] && this._listeners[type].length > 0) {

            let evt = new ShifterEvent();
            evt.target = this._target;
            evt.type = type;

            let props = this._manager.state;
            let keys = Object.keys(props);

            for (let i = 0; i < keys.length; i++) {
                let k = keys[i];
                evt[k] = props[k];
            }

            console.log(evt);
            this.dispatch(type, evt);
        }
    }

    /*
        matrix( scaleX(0), skewY(1), skewX(2), scaleY(3), translateX(4), translateY(5) )
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
    CANCELLED: "cancelled",
    CLICK: "click",
    SWIPE: "swipe",
    TARGET_MOVED: "targetmoved",
    UP: "up",
};


Object.freeze(Shifter.Evt);
Object.freeze(Shifter.Func);

export default Shifter;
export { Shifter };
