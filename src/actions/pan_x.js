import Action from "./action";

// [4, (5)]

export default class Pan_X extends Action {

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
