import { getDayOfWeek, getStringForNow, parseDate } from "../../utils.ts/dateUtils";
import { DbController } from "../DBcontroller";
import { Departure } from "../types";

export class RouteDBController {
    controller: DbController;
    constructor(schemaName: string) {
        this.controller = new DbController(schemaName);
    }

    async getRoutesForStop(stopId: string, startDate: string = getStringForNow()) {
        const [trips, routes, calendars, stopTimes, stops] = this.controller.getTableNames(["trips", "routes", "calendars", "stop_times", "stops"]);
        const variables = [stopId, startDate];
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
        return await this.controller.customQuery<Departure>(queryString, variables);
    }

    async getRoutesForDay(offset: number, startDate: string = getStringForNow()){
        const variables = [startDate];
        const dayOfWeek = getDayOfWeek(parseDate(startDate));
        const [trips, routes, calendars, stopTimes, stops] = this.controller.getTableNames(["trips", "routes", "calendars", "stop_times", "stops"]);

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
        return await this.controller.customQuery<Departure>(queryString, variables)
    }
}