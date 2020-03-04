import Action from "./action";

// 4, 5
export default class Pan extends Action {

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
