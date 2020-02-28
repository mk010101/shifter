import {Dispatcher} from "./Dispatcher.js";


class Shifter extends Dispatcher {
    constructor() {
        super();
        console.log(this);
    }
}


export default {Shifter};
export {Shifter};