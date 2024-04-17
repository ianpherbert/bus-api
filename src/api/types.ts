import { Calendar, Route, Trip, CalendarDate, Stop, StopTime, Departure } from "../database/types";
import { formatMoreThan24hourClock } from "../utils.ts/dateUtils";

type ApiType = { companyCode: string }

export type ApiRoute = Route & ApiType;

export type ApiTrip = Trip & ApiType;

export type ApiCalendar = Calendar & ApiType;

export type ApiCalendarDate = CalendarDate & ApiType;

export type ApiStop = Stop & ApiType;

export type ApiStopTime = StopTime & ApiType;

export type ApiDeparture = Departure & ApiType;


export class DepartureStop{
    arrivalTime: Date;
    departureTime: Date;
    name: string;
    latitude: number;
    longitude: number;
    stopId: string
    sequence: number;
    constructor({
        arrival_time,
        departure_time,
        stop_name,
        stop_lat,
        stop_lon,
        stop_id,
        stop_sequence,
    }: ApiDeparture, date: Date){
        this.arrivalTime = formatMoreThan24hourClock(arrival_time, date);
        this.departureTime = formatMoreThan24hourClock(departure_time, date);
        this.name = stop_name;
        this.latitude = Number(stop_lat);
        this.longitude = Number(stop_lon);
        this.stopId = stop_id;
        this.sequence = stop_sequence;
    }
}

export class DepartureGroup {
    trip_id: string;
    route_long_name: string;
    start_date: string;
    end_date: string;
    companyCode: string;
    stops: DepartureStop[] = [];
    private date;
    constructor(departure: ApiDeparture, date: Date) {
        this.trip_id = departure.trip_id;
        this.route_long_name = departure.route_long_name;
        this.start_date = departure.start_date;
        this.end_date = departure.end_date;
        this.companyCode = departure.companyCode;
        this.stops.push(new DepartureStop(departure, date))
        this.date = date;
    }
    addStop(departure: ApiDeparture) {
        this.stops.push(new DepartureStop(departure, this.date))
    }
}