"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteDBController = void 0;
const dateUtils_1 = require("../../utils.ts/dateUtils");
const DBcontroller_1 = require("../DBcontroller");
class RouteDBController {
    constructor(schemaName) {
        this.controller = new DBcontroller_1.DbController(schemaName);
    }
    getRoutesForStop(stopId_1) {
        return __awaiter(this, arguments, void 0, function* (stopId, startDate = (0, dateUtils_1.getStringForNow)()) {
            const [trips, routes, calendars, stopTimes, stops] = this.controller.getTableNames(["trips", "routes", "calendars", "stop_times", "stops"]);
            const variables = [stopId, startDate];
            const dayOfWeek = (0, dateUtils_1.getDayOfWeek)((0, dateUtils_1.parseDate)(startDate));
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
            return yield this.controller.customQuery(queryString, variables);
        });
    }
    getRoutesForDay(offset_1) {
        return __awaiter(this, arguments, void 0, function* (offset, startDate = (0, dateUtils_1.getStringForNow)()) {
            const variables = [startDate];
            const dayOfWeek = (0, dateUtils_1.getDayOfWeek)((0, dateUtils_1.parseDate)(startDate));
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
            return yield this.controller.customQuery(queryString, variables);
        });
    }
}
exports.RouteDBController = RouteDBController;
