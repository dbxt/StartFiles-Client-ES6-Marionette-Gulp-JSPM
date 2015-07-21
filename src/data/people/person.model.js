import Backbone from "backbone";

class PersonModel extends Backbone.Model {
    constructor(params, options) {
        super(params, options);
        this.on("invalid", function(m){
           alert(m.validationError);
        });
    }

    validate(atts, opts) {
        if (!(atts.email && atts.userName)) {
            return "Need Email AND User Name";
        }
    }

    get defaults() {
        return {
            first: "Bob",
            last: "Tanks",
            email: "bob@bob.com"
        }
    }

    get url() {
        return "/users";
    }

    select(){
        app.trigger("person:selected", this);
    }
}

export default PersonModel;