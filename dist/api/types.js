"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartureGroup = exports.DepartureStop = void 0;
const dateUtils_1 = require("../utils.ts/dateUtils");
class DepartureStop {
    constructor({ arrival_time, departure_time, stop_name, stop_lat, stop_lon, stop_id, stop_sequence, }, date) {
        this.arrivalTime = (0, dateUtils_1.formatMoreThan24hourClock)(arrival_time, date);
        this.departureTime = (0, dateUtils_1.formatMoreThan24hourClock)(departure_time, date);
        this.name = stop_name;
        this.latitude = Number(stop_lat);
        this.longitude = Number(stop_lon);
        this.stopId = stop_id;
        this.sequence = stop_sequence;
    }
}
exports.DepartureStop = DepartureStop;
class DepartureGroup {
    constructor(departure, date) {
        this.stops = [];
        this.trip_id = departure.trip_id;
        this.route_long_name = departure.route_long_name;
        this.start_date = departure.start_date;
        this.end_date = departure.end_date;
        this.companyCode = departure.companyCode;
        this.stops.push(new DepartureStop(departure, date));
        this.date = date;
        this.route_id = departure.route_id;
    }
    addStop(departure) {
        this.stops.push(new DepartureStop(departure, this.date));
    }
}
exports.DepartureGroup = DepartureGroup;
