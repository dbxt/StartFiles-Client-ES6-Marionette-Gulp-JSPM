import $ from "jquery";
import _ from "underscore";
import Bootstrap from "bootstrap";
import Backbone from "backbone";
import Marionette from "backbone.marionette";

import "./theme/bootstrap.css!";
import "./theme/bootstrap.superhero.min.css!";

// App Config
class App extends Marionette.Application {
}
class AppController extends Marionette.Controller {
    showIndex() {
        app.mainRegion.show(new IndexView());
    }

    showPeople() {
        let personListView = new PersonListView({collection: app.People});

        app.mainRegion.show(personListView);
        app.AppRouter.navigate("people");
    }

    showPersonDetail(person) {
        var layout = new PersonDetailLayoutView({model: person});
        app.mainRegion.show(layout);
        layout.summary.show(new PersonSummaryView({model: person}));
        layout.detail.show(new PersonDetailView({model: person}));
        app.AppRouter.navigate("people/" + person.id);
    }
}

// Data
class PersonModel extends Backbone.Model {
    constructor(params, options) {
        super(params, options);
        this.on("invalid", function (m) {
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

    select() {
        app.trigger("person:selected", this);
    }
}
class PersonCollection extends Backbone.Collection {
    get model() {
        return PersonModel;
    }
}

class AppRouter extends Backbone.Router {
    get routes() {
        return {
            "": "showIndex",
            "people": "showPeople",
            "people/:id": "showPersonDetail"
        }
    }

    showIndex() {
        app.trigger("index:requested");
    }

    showPeople() {
        app.trigger("person:listing:requested");
    }

    showPersonDetail(id) {
        let person = app.People.get(id);
        person.select();
    }
}
class IndexView extends Marionette.ItemView {
    get template() {
        return "#index-template"
    }

    get events() {
        return this._events = {
            "click #nav-people-index": "showPersonList"
        }
    }

    set events(value) {
        this._events = value;
    }

    showPersonList(e) {
        e.preventDefault();
        app.trigger("person:listing:requested");
    }
}

// Views
class PersonListView extends Marionette.CollectionView {
    get tagName() {
        return "table";
    }

    get className() {
        return "table table-striped";
    }

    get childView() {
        return PersonItemView;
    }

    onBeforeRender() {
        this.$el.append("<h2>People</h2>");
    }
}
class PersonItemView extends Marionette.ItemView {
    get tagName() {
        return "tr";
    }

    get template() {
        return _.template("<td><%=first%></td><td><%=last%></td><td><%=email%></td><td><a href='#'>Details</a></td>");
    }

    get events() {
        return this._events = {
            "click a": "showPersonDetail"
        }
    }

    set events(value) {
        this._events = value;
    }

    showPersonDetail(e) {
        e.preventDefault();
        this.model.select();
        //app.AppController.showPersonDetail(this.model.id);
    }
}

class PersonDetailLayoutView extends Marionette.LayoutView {
    get template() {
        return "#person-layout-template";
    }

    get regions() {
        return this._regions = {
            summary: "#summary",
            detail: "#detail"
        }
    }

    set regions(value) {
        this._regions = value;
    }
}
class PersonSummaryView extends Marionette.ItemView {
    get template() {
        return "#person-summary-template";
    }
}
class PersonDetailView extends Marionette.ItemView {
    get template() {
        return "#person-detail-template";
    }
}


class BreadCrumbController extends Marionette.Controller {
    showHome() {
        let crumbs = new BreadCrumbCollection([{title: "Home", callback: null}]);
        this.renderView(crumbs);
    }

    showPeople() {
        let crumbs = new BreadCrumbCollection([
            {title: "Home", callback: null},
            {title: "People", callback: null}
        ]);
        this.renderView(crumbs);
    }

    showPerson(person) {
        let crumbs = new BreadCrumbCollection([
            {title: "Home", callback: null},
            {title: "People", callback: null},
            {title: person.attributes.first, callback: null}
        ]);
        this.renderView(crumbs);
    }

    renderView(crumbs) {
        let breadCrumbList = new BreadCrumbListView({collection: crumbs});
        app.navRegion.show(breadCrumbList);
    }
}
class BreadCrumbCollection extends Backbone.Collection {
    get model() {
        return BreadCrumbItem;
    }
}
class BreadCrumbItem extends Backbone.Model {
    select(){
        this.trigger("breadcrumb:selected", this);
    }
}
class BreadCrumbListView extends Marionette.CollectionView {
    get tagName() {
        return "ol";
    }

    get className() {
        return "breadcrumb";
    }

    get childView() {
        return BreadCrumbItemView;
    }
}
class BreadCrumbItemView extends Marionette.ItemView {
    get tagName() {
        return "li";
    }

    get template() {
        return _.template("<a href='#'><%=title%></a>");
    }

    get events() {
        return this._events = {
            "click a": "fireTrigger"
        }
    }
    set events(value) {
        this._events = value;
    }

    fireTrigger(e){
        e.preventDefault();
        this.model.select();
    }
}

let app = new App();

// events
app.addInitializer(function () {
    let crumbs = {
        home: {title: "Home", callback: "index:requested"},
        people: {title: "People", callback: "person:listing:requested"},
        person: {title: "Person", callback: "person:selected"}
    };

    app.on("index:requested", function () {
        app.AppController.showIndex();
        app.BreadCrumbs.reset(crumbs.home);
    });
    app.on("person:selected", function (person) {
        app.AppController.showPersonDetail(person);
        app.BreadCrumbs.reset(crumbs.home, crumbs.people, crumbs.person);
    });
    app.on("person:listing:requested", function () {
        app.AppController.showPeople();
        app.BreadCrumbs.reset(crumbs.home, crumbs.people);
    });
});

// objects
app.addInitializer(function () {
    app.addRegions({
        mainRegion: "#AppContainer",
        navRegion: "#AppBreadCrumbs"
    });

    // inits
    app.AppController = new AppController();

    app.AppRouter = new AppRouter();
    app.People = new PersonCollection(
        [
            {id: 1, first: "Al", last: "Allen", email: "a@a.com", userName: "aaa"},
            {id: 2, first: "Bob", last: "Bagley", email: "b@b.com", userName: "bbb"},
            {id: 3, first: "Carl", last: "Carlson", email: "c@c.com", userName: "ccc"},
            {id: 4, first: "Dan", last: "Daniels", email: "d@d.com", userName: "ddd"},
            {id: 5, first: "Earl", last: "Earley", email: "e@e.com", userName: "eee"},
            {id: 6, first: "Fred", last: "Fredericks", email: "f@f.com", userName: "fff"}
        ]
    );
    app.BreadCrumbController = new BreadCrumbController();
    app.BreadCrumbs = new BreadCrumbCollection([{title: "Home", callback: null}]);
    app.BreadCrumbs.on("breadcrumb:selected", function (crumb) {
        console.log("Hello");
        app.trigger(crumb.attributes.trigger);
    });

    app.navRegion.show(new BreadCrumbListView({collection: app.BreadCrumbs}));

    // events
    app.on("person:selected", function (person) {
        app.AppController.showPersonDetail(person);
    });

    Backbone.history.start();
});

app.start();