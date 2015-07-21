import PersonModel from "./data/people/person.js";

var m = new PersonModel({
    first: "Steve"
});
console.log(m.isValid());
console.log(m.validationError);