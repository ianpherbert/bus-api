import { DbNotFoundError } from "../../errors/DbErrors";
import { DbArg, DbController } from "../DBcontroller";
import { Location, LocationItem } from "../types";

export class LocationDBController {
    tables = {
        locations: "locations"
    }
    controller: DbController;
    constructor() {
        this.controller = new DbController("bus_api");
    }

    async findById(id: string) {
        const results = await this.findByNamePostalCodeOrId(id)
        if (!Boolean(results.length)) throw new DbNotFoundError("Not found", 404)
        return results[0]
    }

    async findByNamePostalCodeOrId(id?: string, postalcode?: string, name?: string) {
        const query: string[] = [];
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
            variables.push(name)
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
        `
        const items = await this.controller.customQuery<LocationItem>(queryString, variables);

        const groups: { [key: string]: Location } = {};
        for (const item of items) {
            if (groups[item.id]) {
                groups[item.id].stops.push(locationItemToStop(item))
            } else {
                groups[item.id] = locationItemToLocation(item)
            }
        }
        return Object.values(groups)
    }
}

const locationItemToStop = ({
    stop_id,
    stop_name,
    stop_lat,
    stop_lon,
    stop_timezone,
    company
}: LocationItem) => ({
    stop_id,
    stop_name,
    stop_lat,
    stop_lon,
    stop_timezone,
    company
})

const locationItemToLocation = ({
    stop_id,
    stop_name,
    stop_lat,
    stop_lon,
    stop_timezone,
    id,
    name,
    postalcode,
    countrycode,
    company,
}: LocationItem): Location => ({
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
})