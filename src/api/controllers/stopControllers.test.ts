import { getMockReq, getMockRes } from '@jest-mock/express'
import { getStop, searchStop } from './stopControllers';
import { TimestampedRequest } from '../handlerType';
import { companies } from '../companies';
import { waitFor } from '../../utils.ts/testUtils';

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
}]

jest.mock('../companies', () => ({
    companies: {
        "Company1": {
            controller: {
                query: (query: string, variables: [string, string][]) => {
                    console.log("c1", query, variables)
                    return new Promise((res) => res(mockStops))
                }
            }, code: "C1"
        }
    },
    companyArray: [{
        controller: {
            query: (query: string, variables: [string, string][]) => {
                console.log("c1", query, variables)
                return new Promise((res) => res(mockStops))
            }
        }, code: "C1"
    }]
}));



describe('searchStop', () => {
    test('should return code 400 with missing type', async () => {
        const req = getMockReq({ query: { queryString: 'someQuery' }, requestTime: Date.now() }) as Omit<TimestampedRequest, "query"> & { query: any };
        const { res } = getMockRes()
        searchStop(req, res, jest.fn());
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "queryType is mandatory with queryString" });
    });
    test('should return code 400 with invalid type', async () => {
        const req = getMockReq({ query: { queryString: 'someQuery', queryType: "test" }, requestTime: Date.now() }) as Omit<TimestampedRequest, "query"> & { query: any };
        const { res } = getMockRes()
        searchStop(req, res, jest.fn());
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "queryType must be of type: name, coordinates. provided: test" });
    });
    test('should return items with 200 name search', async () => {
        const req = getMockReq({ query: { queryString: 'someQuery', queryType: "name", requestTime: Date.now().toString() } }) as Omit<TimestampedRequest, "query"> & { query: any };
        const { res } = getMockRes();
        searchStop(req, res, jest.fn());
        await waitFor(() => {
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ count: mockStops.length }));
        }, 500)
    });
    test('should return items with 200 coordinates search', async () => {
        const req = getMockReq({ query: { queryString: '44,55', queryType: "coordinates", requestTime: Date.now().toString() } }) as Omit<TimestampedRequest, "query"> & { query: any };
        const { res } = getMockRes();
        searchStop(req, res, jest.fn());
        await waitFor(() => {
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ count: mockStops.length }));
        }, 500)
    });
});

describe("getstop", async () => {
    const req = getMockReq({ params: { stopId: "945" } }) as Omit<TimestampedRequest, "params"> & { params: any };
    const { res } = getMockRes();
    getStop(req, res, jest.fn());
    await waitFor(() => {
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ count: mockStops.length }));
    }, 500)
})