import {Dispatcher} from "./Dispatcher.js";
import Pan from "./actions/pan.js";
import Pan_X from "./actions/pan_x";
import Zoom from "./actions/zoom.js";


import {
    splitTransformMatrix,
} from "./utils.js";

import Recognizer from "./recognizer.js";
import ShifterEvent from "./evt/shifterevent";


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


export default class Shifter extends Dispatcher {


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

        if (this._funcs.length > 0) {
            //this._prevTransforms = this._funcs[0].transforms.concat();
        }

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

            console.log(evt)
            this.dispatch(type, evt)
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


export {Shifter};

