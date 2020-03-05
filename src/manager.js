//import Recognizer from "./recognizers/recognizer";
//import ShifterEvent from "./evt/shifterevent";


import {splitTransformMatrix} from "./utils";

export default class Manager {


    constructor(target) {

        this._target = target;
        this._initMatrix = "";
        this._movesStack = [];
        this._initTime = 0;
        this._x0 = 0;
        this._y0 = 0;
        this._x1 = 0;
        this._y1 = 0;
        this._isRunning = false;

        this.evtProps = {
            duration: 0,
            velocityX: 0,
            velocityY: 0,
            targetTransformed: false,
            translatedX: 0,
            translatedY: 0,
            scale: 1,
        };

        this.tick = this.tick.bind(this);

    }


    onDown(e) {
        this._initTime = Date.now();
        this._movesStack = [];
        this._x0 = e.clientX;
        this._y0 = e.clientY;
        this._initMatrix = this._getMatrixString();
        this.evtProps.targetTransformed = false;
        this.evtProps.translatedX = 0;
        this.evtProps.translatedY = 0;
        this._isRunning = true;
        requestAnimationFrame(this.tick);
    }

    onMove(e) {

        this._x1 = e.clientX;
        this._y1 = e.clientY;


        //let {vx, vy} = getAvgSpeed(this._movesStack);
        //console.log(vx, vy)

    }

    tick() {

        this._movesStack.push({vx: this._x1 - this._x0, vy: this._y1 - this._y0});
        if (this._movesStack.length > 20) {
            this._movesStack.shift();
        }
        this._x0 = this._x1;
        this._y0 = this._y1;

        if (this._isRunning) requestAnimationFrame(this.tick)
    }


    onUp(e) {
        let {vx, vy} = getAvgSpeed(this._movesStack);

        this.evtProps.duration = Date.now() - this._initTime;
        this.evtProps.velocityX = vx || 0;
        this.evtProps.velocityY = vy || 0;
        this._compareMtx();

        this._isRunning = false;
        console.log(this.evtProps)


    }

    onWheel(e) {

    }

    onCancelled(e) {
        this._isRunning = false;
    }

    /*
        matrix( scaleX(0), skewY(1), skewX(2), scaleY(3), translateX(4), translateY(5) )
     */

    _compareMtx() {
        let newMatrix = this._getMatrixString();
        if(this._initMatrix !== newMatrix) {
            this.evtProps.targetTransformed = true;

            let t0 = splitTransformMatrix(this._initMatrix);
            let t1 = splitTransformMatrix(newMatrix);

            if (t0[4] !== t1[4]) this.evtProps.translatedX = t1[4] - t0[4];
            if (t0[5] !== t1[5]) this.evtProps.translatedY = t1[5] - t0[5];

        }
    }

    _getMatrixString(){
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