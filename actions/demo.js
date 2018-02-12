import httpStatusCodes from '../conf/httpStatusCodes';
import httpMethods from '../conf/httpMethods';
import Action from '../lib/Action';
import ArgTypes from '../lib/ArgTypes';

export default class extends Action {
    constructor(ctx) {
        super(ctx);
        this.argTypes = {
            name: ArgTypes.string.isRequired,
            age: ArgTypes.number
        };
        this.defaultArgs = {
            age: 18
        };
    }

    get(args) {
        this.setStatus(httpStatusCodes.OK);
        this.setBody(args);
    }
}
