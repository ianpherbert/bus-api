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
const stopControllers_1 = require("./stopControllers");
const testUtils_1 = require("../../utils.ts/testUtils");
const mockStops = [{
        stop_id: "1001",
        stop_name: "Central Station",
        stop_lat: 48.8566,
        stop_lon: 2.3522,
        stop_timezone: "Europe/Paris"
    },
    {
        stop_id: "1002",
        stop_name: "Market Street",
        stop_lat: 37.7749,
        stop_lon: -122.4194,
        stop_timezone: "America/Los_Angeles"
    },
    {
        stop_id: "1003",
        stop_name: "Downtown Crossing",
        stop_lat: 42.3554,
        stop_lon: -71.0605,
        stop_timezone: "America/New_York"
    },
    {
        stop_id: "1004",
        stop_name: "Kings Cross",
        stop_lat: 51.5308,
        stop_lon: -0.1238,
        stop_timezone: "Europe/London"
    },
    {
        stop_id: "1005",
        stop_name: "Harbourfront",
        stop_lat: 1.2644,
        stop_lon: 103.8208,
        stop_timezone: "Asia/Singapore"
    }];
jest.mock('../companies', () => ({
    companies: {
        "Company1": {
            controllers: {
                stop: {
                    getById: () => new Promise((res) => res(mockStops)),
                    findByCoordinates: () => new Promise(res => res(mockStops)),
                    findByProperty: () => new Promise(res => res(mockStops))
                }
            }, code: "C1"
        }
    },
    companyArray: [{
            controllers: {
                stop: {
                    getById: () => new Promise((res) => res(mockStops)),
                    findByCoordinates: () => new Promise(res => res(mockStops)),
                    findByProperty: () => new Promise(res => res(mockStops))
                }
            }, code: "C1"
        }]
}));
describe('searchStop', () => {
    test('should return code 400 with missing type', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = (0, express_1.getMockReq)({ query: { queryString: 'someQuery' }, requestTime: Date.now() });
        const { res } = (0, express_1.getMockRes)();
        (0, stopControllers_1.searchStop)(req, res, jest.fn());
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "queryType is mandatory with queryString" }));
    }));
    test('should return code 400 with invalid type', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = (0, express_1.getMockReq)({ query: { queryString: 'someQuery', queryType: "test" }, requestTime: Date.now() });
        const { res } = (0, express_1.getMockRes)();
        (0, stopControllers_1.searchStop)(req, res, jest.fn());
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "queryType must be of type: name, coordinates. provided: test" }));
    }));
    test('should return items with 200 name search', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = (0, express_1.getMockReq)({ query: { queryString: 'someQuery', queryType: "name", requestTime: Date.now().toString() } });
        const { res } = (0, express_1.getMockRes)();
        (0, stopControllers_1.searchStop)(req, res, jest.fn());
        yield (0, testUtils_1.waitFor)(() => {
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ count: mockStops.length }));
        }, 500);
    }));
    test('should return items with 200 coordinates search', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = (0, express_1.getMockReq)({ query: { queryString: '44,55', queryType: "coordinates", requestTime: Date.now().toString() } });
        const { res } = (0, express_1.getMockRes)();
        (0, stopControllers_1.searchStop)(req, res, jest.fn());
        yield (0, testUtils_1.waitFor)(() => {
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ count: mockStops.length }));
        }, 500);
    }));
});
describe("getstop", () => {
    test("", () => __awaiter(void 0, void 0, void 0, function* () {
        const req = (0, express_1.getMockReq)({ params: { stopId: "945" } });
        const { res } = (0, express_1.getMockRes)();
        (0, stopControllers_1.getStop)(req, res, jest.fn());
        yield (0, testUtils_1.waitFor)(() => {
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ count: mockStops.length }));
        }, 500);
    }));
});
