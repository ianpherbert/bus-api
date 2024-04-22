import { Departure, Stop } from "../../database/types";
import { getDayOfWeek, getStringForNow, parseDate } from "../../utils.ts/dateUtils";
import { dbToApi } from "../../utils.ts/mappingUtils";
import { Company, companyArray } from "../companies";
import { HandlerWithQueryAndParamsType, HandlerWithQueryType } from "../handlerType";
import { QueryResponseType } from "../responseType";
import { ApiDeparture, DepartureGroup } from "../types";

/**
 * Asynchronously finds companies that match a given criteria in a database table.
 * @param key - The database column to search against.
 * @param value - The value to match in the specified database column.
 * @param tableName - The name of the database table to search.
 * @returns  - A promise that resolves to an array of companies that match the given criteria.
 */
export async function findCompany(value: string) {
    const companies: Company[] = [];
    const promises = companyArray.map((company) => company.controllers.company.findCompany(value).then(found => {
            if (found) companies.push(company)
        }));
    await Promise.all(promises);
    return companies
}

function groupDepartures(data: ApiDeparture[][], startDate: string) {
    const groups: { [key: string]: DepartureGroup; } = {};
    for (const item of data.flat()) {
        if (!groups[item.trip_id]) {
            groups[item.trip_id] = new DepartureGroup(item, parseDate(startDate));
        } else {
            groups[item.trip_id].addStop(item);
        }
    }
    return groups
}

/**
 * Handler to get departures for a specified stop on a given date.
 */
export const getRoutesForStop: HandlerWithQueryAndParamsType<{ date?: string; }, { stopId: string; }> = async ({ params, query }, res) => {
    const companies = await findCompany(params.stopId);
    const startDate = query.date ?? getStringForNow();
    const promises = [];
    for (const { code, controllers } of companies) {
        try {
            const data = await controllers.route.getRoutesForStop(params.stopId, query.date).then(a => a.map(it => mapToApiStop(it, code)));
            promises.push(data);
        } catch (e) {
            res.status(400).json({ message: e });
            return;
        }

    }
    const data = await Promise.all(promises);

    const groups = groupDepartures(data, startDate);
    res.status(200).json(new QueryResponseType(Object.values(groups), { ...query, ...params }));
};

export const getRoutesForDay: HandlerWithQueryType<{ date: string; page: string }> = async ({ query }, res) => {
    const startDate = query.date ?? getStringForNow();
    const promises = [];
    const offset = query.page ? Number(query.page) : 0;
    for (const { code, controllers } of companyArray) {
        try {

            const data = await controllers.route.getRoutesForDay(offset).then(a => a.map(it => mapToApiStop(it, code)));
            promises.push(data);
        } catch (e) {
            res.status(400).json({ message: e });
            return;
        }

    }
    const data = await Promise.all(promises);
    const groups = groupDepartures(data, startDate);
    res.status(200).json(new QueryResponseType(Object.values(groups), { ...query }));
}

/**
 * Converts a database Departure object to an API-conformant Departure object.
 * @param stop - The departure data retrieved from the database.
 * @param companyCode - The company code to include in the API data.
 * @returns The API-formatted departure data.
 */
export function mapToApiStop(stop: Departure, companyCode: string) {
    return dbToApi<Departure, ApiDeparture>(stop, [{ key: "companyCode", value: companyCode }])
}