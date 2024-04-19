import { getMockReq, getMockRes } from "@jest-mock/express";
import { Departure } from "../../database/types";
import { TimestampedRequest } from "../handlerType";
import { getRoutesForDay, getRoutesForStop } from "./routeControllers";
import { waitFor } from "../../utils.ts/testUtils";

function generateMockDepartures(num: number): Departure[] {
    const departures: Departure[] = [];

    for (let i = 0; i < num; i++) {
        departures.push({
            arrival_time: `08:46:00`,
            route_id: `route_${i}`,
            departure_time: `07:30:00`,
            trip_id: `trip_${i}`,
            route_long_name: `Route ${i}`,
            start_date: "20240419",
            end_date: "20240425",
            stop_name: `Stop ${i}`,
            stop_lat: (34.0522 + i * 0.01).toFixed(4),
            stop_lon: (-118.2437 - i * 0.01).toFixed(4),
            stop_id: `stop_${i}`,
            stop_sequence: i,
            stop_timezone: "America/Los_Angeles"
        });
    }

    return departures;
}

jest.mock('../companies', () => ({
    companies: {
        "Company1": {
            controller: {
                checkValue: () => new Promise(res => res(true)),
                customQuery: (_: string, _1: [string, string][]) => {
                    return new Promise((res) => res(generateMockDepartures(50)))
                },
                getTableNames: (tables: string[]) => {
                    return tables.map(it => `${"test"}.${it}`)
                }
            }, code: "C1"
        }
    },
    companyArray: [{
        controller: {
            checkValue: () => new Promise(res => res(true)),
            customQuery: (_: string, _1: [string, string][]) => {
                return new Promise((res) => res(generateMockDepartures(50)))
            },
            getTableNames: (tables: string[]) => {
                return tables.map(it => `${"test"}.${it}`)
            }
        }, code: "C1"
    }]
}));


describe("getRoutesForStop", () => {
    test('should return departure groups', async () => {
        const req = getMockReq({ query: { date: '20240506' }, params: { stopId: "test" }, requestTime: Date.now() }) as Omit<TimestampedRequest, "query" | "params"> & { query: any, params: any };
        const { res } = getMockRes()
        getRoutesForStop(req, res, jest.fn());
        await waitFor(() => {
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ count: 50 }));
        }, 1500)

    });
})

describe("getRoutesForDay", () => {
    test('should return departure groups', async () => {
        const req = getMockReq({ query: { date: '20240506' }, requestTime: Date.now() }) as Omit<TimestampedRequest, "query"> & { query: any };
        const { res } = getMockRes()
        getRoutesForDay(req, res, jest.fn());
        await waitFor(() => {
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ count: 50 }));
        }, 1500)

    });
})
