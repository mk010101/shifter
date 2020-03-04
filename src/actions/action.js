export default class Action {


    constructor(target, transforms) {

        this._target = target;
        this.transforms = transforms;
        this._pointers = [];
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

    onWheel(e) {

    }

}