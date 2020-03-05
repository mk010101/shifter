import {Dispatcher} from "./Dispatcher.js";
import Pan from "./actions/pan.js";
import Pan_X from "./actions/pan_x";
import Zoom from "./actions/zoom.js";

import Click from "./recognizers/click.js";
import Swipe from "./recognizers/swipe.js";

import {
    splitTransformMatrix,
} from "./utils.js"


const CssProps = {
    userSelect: "none",
    webkitTouchCallout: "none",
    webkitUserSelect: "none",
    userDrag: "none",
    touchAction: "none"
};

const Events = {
    click: Click,
    swipe: Swipe,
};


export default class Shifter extends Dispatcher {


    constructor(target, funcs = null, cssProps = null) {

        super();

        this._target = target;
        this._funcs = [];
        this._gestures = [];
        this._recognizers = [];
        this._disabled = false;
        this._isPassiveEvt = true;
        this._prevTransforms = [];

        this._init(funcs);

    }


    on(event, listener) {

        let evt = {
            name: "",
            evt: null
        };

        if (Events[event]) {
            evt.name = event;
            evt.recognizer = new Events[event](this);
            this._recognizers.push(evt);
            super.on(evt.name, listener);
        } else {
            super.on(event, listener);
        }

        return this;
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

        for (let i = 0; i < this._funcs.length; i++) {
            this._funcs[i].onDown(e);
        }

        if (this._funcs.length > 0) {
            this._prevTransforms = this._funcs[0].transforms.concat();
        }

        for (let i = 0; i < this._recognizers.length; i++) {
            this._recognizers[i].recognizer.onDown(e);
        }

        this._target.addEventListener("pointermove", this._pMove, {passive: this._isPassiveEvt});

    }


    _pMove(e) {

        for (let i = 0; i < this._funcs.length; i++) {
            this._funcs[i].onMove(e);
        }

        for (let i = 0; i < this._recognizers.length; i++) {
            this._recognizers[i].recognizer.onMove(e);
        }

        this._setTransforms();
    }


    _pUp(e) {

        for (let i = 0; i < this._funcs.length; i++) {
            this._funcs[i].onUp(e);
        }

        for (let i = 0; i < this._recognizers.length; i++) {
            this._recognizers[i].recognizer.onUp(e);

        }

        this._target.removeEventListener("pointermove", this._pMove);

        //console.log(this._prevTransforms, this._funcs[0].transforms)
    }


    _pCancelled(e) {
        for (let i = 0; i < this._funcs.length; i++) {
            this._funcs[i].onCancelled(e);
        }
        this._target.removeEventListener("pointermove", this._pMove);
        console.log("Shifter: evt cancelled")
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
    // PAN_X_START: "panXStart",
    // PAN_X_PROGRESS: "panXProgress",
    // PAN_X_END: "panXEnd",
    // PAN_START: "panStart",
    // PAN_PROGRESS: "panProgress",
    // PAN_END: "panEnd",
    // START: "start",
    // MOVE: "move",
    // UP: "up",
    // CANCELLED: "cancelled",
    CLICK: "click",
    SWIPE: "swipe",
};


Object.freeze(Shifter.Evt);
Object.freeze(Shifter.Func);


export {Shifter};

