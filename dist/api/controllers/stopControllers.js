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
exports.getStop = exports.searchStop = void 0;
const ApiErrors_1 = require("../../errors/ApiErrors");
const mappingUtils_1 = require("../../utils.ts/mappingUtils");
const stringUtils_1 = require("../../utils.ts/stringUtils");
const companies_1 = require("../companies");
const responseType_1 = require("../responseType");
/**
 * Enum for search stop query types.
 */
var SearchStopQueryType;
(function (SearchStopQueryType) {
    SearchStopQueryType["NAME"] = "name";
    SearchStopQueryType["COORDINATES"] = "coordinates";
})(SearchStopQueryType || (SearchStopQueryType = {}));
/**
 * Mapping from query type to database column.
 */
const typeColumnMapping = {
    [SearchStopQueryType.NAME]: "stop_name",
    [SearchStopQueryType.COORDINATES]: "stop_lat"
};
const typeNames = Object.keys(typeColumnMapping).reduce((a, b) => a + ", " + b);
/**
 * Searches for stops based on a query.
 * @throws Throws an error if query fails.
 */
const searchStop = (_a, res_1) => __awaiter(void 0, [_a, res_1], void 0, function* ({ query, requestTime }, res) {
    var _b, _c;
    const { queryString, queryType, exact, companies: companyString } = query;
    const companyList = companyString ? (_b = (0, stringUtils_1.normaliseStringToArray)(companyString)) === null || _b === void 0 ? void 0 : _b.map(it => companies_1.companies[it]).filter(Boolean) : companies_1.companyArray;
    if (queryString && !queryType) {
        res.status(400).json(new ApiErrors_1.MissingArgumentError("queryType is mandatory with queryString", queryType, typeNames));
        return;
    }
    function doCoordinateSearch(_a) {
        return __awaiter(this, arguments, void 0, function* ({ code, controllers }) {
            const [lat, lon] = queryString.split(",");
            return controllers.stop.findByCoordinates(lat, lon).then(a => a.map(it => mapToApiStop(it, code)));
        });
    }
    function doPropertySearch(_a) {
        return __awaiter(this, arguments, void 0, function* ({ controllers, code }) {
            return controllers.stop.findByProperty(column, queryString, Boolean(exact)).then(a => a.map(it => mapToApiStop(it, code)));
        });
    }
    const column = typeColumnMapping[queryType];
    if (!column) {
        res.status(400).json(new ApiErrors_1.TypeMismatchError(`queryType must be of type: ${typeNames}. provided: ${queryType}`, "queryType", queryType, typeNames));
        return;
    }
    const promises = [];
    for (const company of companyList) {
        try {
            const promise = queryType === SearchStopQueryType.COORDINATES ? doCoordinateSearch(company) : doPropertySearch(company);
            promises.push(promise);
        }
        catch (e) {
            const error = e;
            res.status((_c = error.code) !== null && _c !== void 0 ? _c : 500).json({ message: e });
        }
    }
    const entries = yield Promise.all(promises);
    res.status(200).json(new responseType_1.QueryResponseType(entries.flat(), query, requestTime));
});
exports.searchStop = searchStop;
/**
 * Retrieves a stop by ID.
 * @throws Throws an error if query fails.
 */
const getStop = (_d, res_2) => __awaiter(void 0, [_d, res_2], void 0, function* ({ params, requestTime }, res) {
    var _e;
    try {
        const promises = [];
        for (const { controllers, code } of companies_1.companyArray) {
            const promise = controllers.stop.getById(params.stopId).then(a => a.map(it => mapToApiStop(it, code)));
            promises.push(promise);
        }
        const entries = yield Promise.all(promises);
        res.status(200).json(new responseType_1.QueryResponseType(entries.flat(), params, requestTime));
    }
    catch (e) {
        const error = e;
        res.status((_e = error.code) !== null && _e !== void 0 ? _e : 500).json(new ApiErrors_1.ApiError(error.message, 500));
    }
});
exports.getStop = getStop;
/**
 * Maps a database Stop object to an API Stop object.
 * @param stop - The stop object from the database.
 * @param companyCode - The code of the company to attribute the stop to.
 * @returns The API model of the stop.
 */
function mapToApiStop(stop, companyCode) {
    return (0, mappingUtils_1.dbToApi)(stop, [{ key: "companyCode", value: companyCode }]);
}
