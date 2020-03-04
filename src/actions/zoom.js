import Action from "./action";


export default class Zoom extends Action {

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
