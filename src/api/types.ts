import { Calendar, Route, Trip, CalendarDate, Stop, StopTime} from "../database/types";

type ApiType = {companyCode: string}

export type ApiRoute = Route & ApiType;

export type ApiTrip = Trip & ApiType;

export type ApiCalendar = Calendar & ApiType;

export type ApiCalendarDate = CalendarDate & ApiType;

export type ApiStop = Stop & ApiType;

export type ApiStopTime = StopTime & ApiType;