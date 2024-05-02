"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyArray = exports.companies = void 0;
const CompanyController_1 = require("../database/controllers/CompanyController");
const RouteController_1 = require("../database/controllers/RouteController");
const StopController_1 = require("../database/controllers/StopController");
const dbs = (name) => ({
    route: new RouteController_1.RouteDBController(name),
    stop: new StopController_1.StopDbController(name),
    company: new CompanyController_1.CompanyDbController(name)
});
/** Use only lowercase letters for the keys, the search will be normalised in order to minimize inconsistencies */
exports.companies = {
    flixbus: {
        dbName: "flixbus",
        name: "flixbus",
        displayName: "Flix Bus",
        code: "fbx",
        controllers: dbs("flixbus")
    },
    blablabus: {
        dbName: "blabla_bus",
        displayName: "Bla Bla Bus",
        code: "bbb",
        name: "blablabus",
        controllers: dbs("blabla_bus")
    }
};
exports.companyArray = Object.values(exports.companies);
