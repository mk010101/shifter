//import Recognizer from "./recognizers/recognizer";
//import ShifterEvent from "./evt/shifterevent";


import {splitTransformMatrix} from "./utils";

export default class Recognizer {


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
            targetPanned: false,
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
        this.state.targetPanned = false;
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

        if (this._isRunning) requestAnimationFrame(this.tick)
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
        console.log(this.state)


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
                this.state.targetPanned = true;
            }

            if (t0[5] !== t1[5]) {
                this.state.panY = t1[5] - t0[5];
                this.state.targetPanned = true;
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

