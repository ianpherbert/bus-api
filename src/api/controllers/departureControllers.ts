import { Departure } from "../../database/types";
import { DbToApi } from "../../utils.ts/mappingUtils";
import { Company, companyArray } from "../companies";
import { ApiDeparture } from "../types";

export async function findCompany<T>(key: keyof T, value: string, tableName: string) {
    const companies: Company[] = [];
    const promises = companyArray.map((company) => company.controller.checkValue<T>(tableName, [[key, value, "eq"]]).then(found => {
        if (found) companies.push(company)
    }));
    await Promise.all(promises);
    return companies
}

export function mapToApiStop(stop: Departure, companyCode: string) {
    return DbToApi<Departure, ApiDeparture>(stop, [{ key: "companyCode", value: companyCode }])
}