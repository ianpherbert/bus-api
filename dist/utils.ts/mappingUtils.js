"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbToApi = void 0;
function dbToApi(dbObject, apiObjectValues) {
    const apiObject = dbObject;
    for (const { key, value } of apiObjectValues) {
        apiObject[key] = value;
    }
    return apiObject;
}
exports.dbToApi = dbToApi;
