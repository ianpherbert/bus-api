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
const express_1 = require("@jest-mock/express");
const routeControllers_1 = require("./routeControllers");
const testUtils_1 = require("../../utils.ts/testUtils");
function generateMockDepartures(num) {
    const departures = [];
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
            controllers: {
                route: {
                    getRoutesForStop: () => new Promise(res => res(generateMockDepartures(50))),
                    getRoutesForDay: () => new Promise(res => res(generateMockDepartures(50))),
                },
                company: {
                    findCompany: () => new Promise(res => res(true))
                }
            }, code: "C1"
        }
    },
    companyArray: [{
            controllers: {
                route: {
                    getRoutesForStop: () => new Promise(res => res(generateMockDepartures(50))),
                    getRoutesForDay: () => new Promise(res => res(generateMockDepartures(50))),
                },
                company: {
                    findCompany: () => new Promise(res => res(true))
                }
            }, code: "C1"
        }]
}));
describe("getRoutesForStop", () => {
    test('should return departure groups', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = (0, express_1.getMockReq)({ query: { date: '20240506' }, params: { stopId: "test" }, requestTime: Date.now() });
        const { res } = (0, express_1.getMockRes)();
        (0, routeControllers_1.getRoutesForStop)(req, res, jest.fn());
        yield (0, testUtils_1.waitFor)(() => {
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ count: 50 }));
        }, 1500);
    }));
});
describe("getRoutesForDay", () => {
    test('should return departure groups', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = (0, express_1.getMockReq)({ query: { date: '20240506' }, requestTime: Date.now() });
        const { res } = (0, express_1.getMockRes)();
        (0, routeControllers_1.getRoutesForDay)(req, res, jest.fn());
        yield (0, testUtils_1.waitFor)(() => {
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ count: 50 }));
        }, 1500);
    }));
});
