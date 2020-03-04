import {Dispatcher} from "./Dispatcher.js";
import Pan from "./actions/pan.js";
import Zoom from "./actions/zoom.js";


export default class Shifter extends Dispatcher {


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


export {Shifter};

