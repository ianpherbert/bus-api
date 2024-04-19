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
export async function findCompany<T>(key: keyof T, value: string, tableName: string) {
    const companies: Company[] = [];
    const promises = companyArray.map((company) => company.controller.checkValue<T>(tableName, [[key, value, "eq"]]).then(found => {
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
export const getRoutesForStop: HandlerWithQueryAndParamsType<{ date: string; }, { stopId: string; }> = async ({ params, query }, res) => {
    const companies = await findCompany<Stop>("stop_id", params.stopId, "stops");
    const startDate = query.date ?? getStringForNow();
    const promises = [];
    for (const { controller, code } of companies) {
        try {
            const [trips, routes, calendars, stopTimes, stops] = controller.getTableNames(["trips", "routes", "calendars", "stop_times", "stops"]);
            const variables = [params.stopId, startDate];
            const dayOfWeek = getDayOfWeek(parseDate(startDate));
            const queryString = `
            WITH RelevantTrips AS (
                SELECT 
                    t.trip_id
                FROM 
                    ${stopTimes} AS s 
                JOIN 
                    ${trips} AS t ON s.trip_id = t.trip_id
                JOIN 
                    ${calendars} AS c ON t.service_id = c.service_id 
                WHERE 
                    s.stop_id = $1
                    AND c.start_date <= $2
                    AND c.end_date >= $2
                    AND c.${dayOfWeek} = '1'
            )
            
            SELECT 
                s.arrival_time, 
                s.departure_time, 
                s.trip_id, 
                s.stop_sequence,
                r.route_long_name, 
                c.start_date, 
                c.end_date,
                st.stop_name,
                st.stop_lat,
                st.stop_lon,
                st.stop_id
            FROM 
                ${stopTimes} AS s
            JOIN 
                ${trips} AS t ON s.trip_id = t.trip_id
            JOIN 
                ${routes} AS r ON t.route_id = r.route_id
            JOIN 
                ${calendars} AS c ON t.service_id = c.service_id
            JOIN 
                ${stops} AS st ON s.stop_id = st.stop_id
            JOIN 
                RelevantTrips AS rt ON t.trip_id = rt.trip_id
            ORDER BY 
                s.trip_id, s.arrival_time
        `;
            const data = await controller.customQuery<Departure>(queryString, variables).then(a => a.map(it => mapToApiStop(it, code)));
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
    for (const { controller, code } of companyArray) {
        try {
            const [trips, routes, calendars, stopTimes, stops] = controller.getTableNames(["trips", "routes", "calendars", "stop_times", "stops"]);
            const variables = [startDate];
            const dayOfWeek = getDayOfWeek(parseDate(startDate));
            const queryString = `
            WITH RelevantTrips AS (
                SELECT 
                    t.trip_id
                FROM 
                    ${trips} AS t
                JOIN 
                    ${calendars} AS c ON t.service_id = c.service_id 
                WHERE 
                    c.start_date <= $1
                    AND c.end_date >= $1
                    AND c.${dayOfWeek} = '1'
            ),
            PaginatedRoutes AS (
                SELECT 
                    DISTINCT r.route_id,
                    r.route_long_name
                FROM 
                    ${routes} AS r
                JOIN 
                    ${trips} AS t ON r.route_id = t.route_id
                JOIN 
                    RelevantTrips AS rt ON t.trip_id = rt.trip_id
                ORDER BY 
                    r.route_id
                    LIMIT 50 OFFSET ${offset}
            )
            SELECT 
                pr.route_id,
                pr.route_long_name,
                s.stop_sequence,
                s.stop_id,
                st.stop_name,
                s.trip_id,
                s.arrival_time, 
                s.departure_time, 
                st.stop_lat,
                st.stop_lon,
                st.stop_id
            FROM 
                PaginatedRoutes AS pr
            JOIN 
                ${trips} AS t ON pr.route_id = t.route_id
            JOIN 
                ${stopTimes} AS s ON t.trip_id = s.trip_id
            JOIN 
                ${stops} AS st ON s.stop_id = st.stop_id
            JOIN 
                RelevantTrips AS rt ON t.trip_id = rt.trip_id
            ORDER BY 
                pr.route_id, s.stop_sequence;`;
            const data = await controller.customQuery<Departure>(queryString, variables).then(a => a.map(it => mapToApiStop(it, code)));
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