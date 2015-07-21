'use strict';
import Backbone from "backbone";
import PersonModel from "./person.model";


class PersonCollection extends Backbone.Collection {
    constructor(params, options) {
        super(params, options);
    }

    get model() {
        return PersonModel;
    }
}

export default PersonCollection;