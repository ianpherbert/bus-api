import { CompanyDbController } from "../database/controllers/CompanyController";
import { RouteDBController } from "../database/controllers/RouteController";
import { StopDbController } from "../database/controllers/StopController";

export type Company = {
    dbName: string;
    displayName: string;
    code: string;
    name: keyof typeof companies;
    controllers: {
        route: RouteDBController;
        stop: StopDbController;
        company: CompanyDbController;
    }
}

const dbs = (name: string) => ({
    route: new RouteDBController(name),
    stop: new StopDbController(name),
    company: new CompanyDbController(name)
})

/** Use only lowercase letters for the keys, the search will be normalised in order to minimize inconsistencies */
export const companies: { [key: string]: Company } = {
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
}

export const companyArray = Object.values(companies)