import { DbController } from "../database/DBcontroller";

export type Company = {
    dbName: string;
    displayName: string;
    code: string;
    controller: DbController
}
/** Use only lowercase letters for the keys, the search will be normalised in order to minimize inconsistencies */
export const companies: { [key: string]: Company } = {
    flixbus: {
        dbName: "flixbus",
        displayName: "Flix Bus",
        code: "fbx",
        controller: new DbController("flixbus")
    },
    blablabus: {
        dbName: "blabla_bus",
        displayName: "Bla Bla Bus",
        code: "bbb",
        controller: new DbController("blabla_bus")
    }
}

export const companyArray = Object.values(companies)