import { Departure, Stop } from "../../database/types";
import { getDayOfWeek, parseDate } from "../../utils.ts/dateUtils";
import { HandlerWithQueryAndParamsType } from "../handlerType";
import { QueryResponseType } from "../responseType";
import { DepartureGroup } from "../types";
import { findCompany, mapToApiStop } from "./departureControllers";


export const getDeparturesForStop: HandlerWithQueryAndParamsType<{ date: string; }, { stopId: string; }> = async ({ params, query }, res, next) => {
    const companies = await findCompany<Stop>("stop_id", params.stopId, "stops");
    const promises = [];
    for (const { controller, code } of companies) {
        try {
            const [trips, routes, calendars, stopTimes, stops] = controller.getTables(["trips", "routes", "calendars", "stop_times", "stops"]);
            const startDate = query.date;
            const variables = [params.stopId, startDate];
            const dayOfWeek = getDayOfWeek(parseDate(query.date));
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

    const groups: { [key: string]: DepartureGroup; } = {};
    for (const item of data.flat()) {
        if (!groups[item.trip_id]) {
            groups[item.trip_id] = new DepartureGroup(item, parseDate(query.date));
        } else {
            groups[item.trip_id].addStop(item);
        }
    }

    res.status(200).json(new QueryResponseType(Object.values(groups), { ...query, ...params }));
};
