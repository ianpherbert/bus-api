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
exports.LocationDBController = void 0;
const DBcontroller_1 = require("../DBcontroller");
class LocationDBController {
    constructor() {
        this.tables = {
            locations: "locations"
        };
        this.controller = new DBcontroller_1.DbController("bus_api");
    }
    findByNamePostalCodeOrId(id, postalcode, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = [];
            const variables = [];
            const propName = "loc";
            if (id) {
                query.push(`${propName}.id = $${query.length + 1}`);
                variables.push(id);
            }
            if (postalcode) {
                query.push(`${propName}.postalcode = $${query.length + 1}`);
                variables.push(postalcode);
            }
            if (name) {
                query.push(`${propName}.name ilike $${query.length + 1}`);
                variables.push(name);
            }
            const queryString = `
        SELECT 
            ${propName}.*, fbx.*, 'fbx' as company
        FROM 
                bus_api.locations as ${propName}
        JOIN 
            flixbus.stops as fbx on fbx.location_id = ${propName}.id
        WHERE
            ${query.join(" AND ")}

        UNION ALL

        SELECT 
        ${propName}.*, bbb.*, 'bbb' as company
        FROM 
            bus_api.locations as ${propName}
        JOIN 
            blabla_bus.stops as bbb on bbb.location_id = ${propName}.id
        WHERE 
            ${query.join(" AND ")}
        `;
            const items = yield this.controller.customQuery(queryString, variables);
            const groups = {};
            for (const item of items) {
                if (groups[item.id]) {
                    groups[item.id].stops.push(locationItemToStop(item));
                }
                else {
                    groups[item.id] = locationItemToLocation(item);
                }
            }
            return Object.values(groups);
        });
    }
}
exports.LocationDBController = LocationDBController;
const locationItemToStop = ({ stop_id, stop_name, stop_lat, stop_lon, stop_timezone, company }) => ({
    stop_id,
    stop_name,
    stop_lat,
    stop_lon,
    stop_timezone,
    company
});
const locationItemToLocation = ({ stop_id, stop_name, stop_lat, stop_lon, stop_timezone, id, name, postalcode, countrycode, company, }) => ({
    id,
    name,
    postalcode,
    countrycode,
    stops: [{
            stop_id,
            stop_name,
            stop_lat,
            stop_lon,
            stop_timezone,
            company
        }]
});
