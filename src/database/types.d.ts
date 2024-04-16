// TypeScript Types
export type Route = {
    route_id: string;
    agency_id: string;
    route_short_name: string;
    route_long_name: string;
};

export type Trip = {
    route_id: string;
    trip_id: string;
    service_id: string;
};

export type Calendar = {
    service_id: string;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
    start_date: Date;
    end_date: Date;
};

export type CalendarDate = {
    service_id: string;
    date: Date;
};

export type Stop = {
    stop_id: string;
    stop_name: string;
    stop_lat: number;
    stop_lon: number;
    stop_timezone: string;
};

export type StopTime = {
    trip_id: string;
    stop_id: string;
    arrival_time: string;  // Assuming time is in string format
    departure_time: string;  // Assuming time is in string format
    stop_sequence: number;
};