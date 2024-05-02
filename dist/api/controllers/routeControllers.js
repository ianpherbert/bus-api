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
exports.mapToApiStop = exports.getRoutesForDay = exports.getRoutesForStop = exports.findCompany = void 0;
const ApiErrors_1 = require("../../errors/ApiErrors");
const dateUtils_1 = require("../../utils.ts/dateUtils");
const mappingUtils_1 = require("../../utils.ts/mappingUtils");
const companies_1 = require("../companies");
const responseType_1 = require("../responseType");
const types_1 = require("../types");
/**
 * Asynchronously finds companies that match a given criteria in a database table.
 * @param key - The database column to search against.
 * @param value - The value to match in the specified database column.
 * @param tableName - The name of the database table to search.
 * @returns  - A promise that resolves to an array of companies that match the given criteria.
 */
function findCompany(value) {
    return __awaiter(this, void 0, void 0, function* () {
        const companies = [];
        const promises = companies_1.companyArray.map((company) => company.controllers.company.findCompany(value).then(found => {
            if (found)
                companies.push(company);
        }));
        yield Promise.all(promises);
        return companies;
    });
}
exports.findCompany = findCompany;
function groupDepartures(data, startDate) {
    const groups = {};
    for (const item of data.flat()) {
        if (!groups[item.trip_id]) {
            groups[item.trip_id] = new types_1.DepartureGroup(item, (0, dateUtils_1.parseDate)(startDate));
        }
        else {
            groups[item.trip_id].addStop(item);
        }
    }
    return groups;
}
/**
 * Handler to get departures for a specified stop on a given date.
 */
const getRoutesForStop = (_a, res_1) => __awaiter(void 0, [_a, res_1], void 0, function* ({ params, query }, res) {
    var _b;
    const companies = yield findCompany(params.stopId);
    const startDate = (_b = query.date) !== null && _b !== void 0 ? _b : (0, dateUtils_1.getStringForNow)();
    const promises = [];
    for (const { code, controllers } of companies) {
        try {
            const data = yield controllers.route.getRoutesForStop(params.stopId, query.date).then(a => a.map(it => mapToApiStop(it, code)));
            promises.push(data);
        }
        catch (e) {
            res.status(400).json(new ApiErrors_1.ApiError(e, 400));
            return;
        }
    }
    const data = yield Promise.all(promises);
    const groups = groupDepartures(data, startDate);
    res.status(200).json(new responseType_1.QueryResponseType(Object.values(groups), Object.assign(Object.assign({}, query), params)));
});
exports.getRoutesForStop = getRoutesForStop;
const getRoutesForDay = (_c, res_2) => __awaiter(void 0, [_c, res_2], void 0, function* ({ query }, res) {
    var _d;
    const startDate = (_d = query.date) !== null && _d !== void 0 ? _d : (0, dateUtils_1.getStringForNow)();
    const promises = [];
    const offset = query.page ? Number(query.page) : 0;
    for (const { code, controllers } of companies_1.companyArray) {
        try {
            const data = yield controllers.route.getRoutesForDay(offset).then(a => a.map(it => mapToApiStop(it, code)));
            promises.push(data);
        }
        catch (e) {
            res.status(400).json(new ApiErrors_1.ApiError(e, 400));
            return;
        }
    }
    const data = yield Promise.all(promises);
    const groups = groupDepartures(data, startDate);
    res.status(200).json(new responseType_1.QueryResponseType(Object.values(groups), Object.assign({}, query)));
});
exports.getRoutesForDay = getRoutesForDay;
/**
 * Converts a database Departure object to an API-conformant Departure object.
 * @param stop - The departure data retrieved from the database.
 * @param companyCode - The company code to include in the API data.
 * @returns The API-formatted departure data.
 */
function mapToApiStop(stop, companyCode) {
    return (0, mappingUtils_1.dbToApi)(stop, [{ key: "companyCode", value: companyCode }]);
}
exports.mapToApiStop = mapToApiStop;
