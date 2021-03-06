import Action from "./action";


export default class Zoom extends Action {

    //0, 3
    constructor(target, transforms) {

        super(target, transforms);
        this.name = "zoom";
        this.minZoom = .5;
        this.maxZoom = 3;
        this._pinchDist0 = 0;
        this.zoomSpeed = 0.025;
        this._scale = transforms[0];
    }


    reset() {
        //this._scale = this.transforms[0];
        this.transforms[0] = 1;
        this.transforms[3] = 1;
        this._scale = 1;
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

            if (dist > this._pinchDist0 && this._scale <= this.maxZoom) {
                this._scale += this.zoomSpeed;
            } else if (dist < this._pinchDist0 && this._scale >= this.minZoom) {
                this._scale -= this.zoomSpeed;
            }
            this._pinchDist0 = dist;
            this.transforms[0] = this._scale;
            this.transforms[3] = this._scale;

        }

    }

    set zoom(value) {
        if (value < this.minZoom) value = this.minZoom;
        if (value > this.maxZoom) value = this.maxZoom;
        this._scale = value;
        this.transforms[0] = this._scale;
        this.transforms[3] = this._scale;
    }

    onWheel(e) {
        this._scale += e.deltaY * -0.001;
        this._scale = Math.min(Math.max(this.minZoom, this._scale), this.maxZoom);
        this.transforms[0] = this._scale;
        this.transforms[3] = this._scale;
    }


}
