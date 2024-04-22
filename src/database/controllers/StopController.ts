
import { DbController } from "../DBcontroller";
import { Stop } from "../types";

export class StopDbController {
    controller: DbController;
    constructor(schemaName: string) {
        this.controller = new DbController(schemaName);
    }
    async findByCoordinates(lat: string, lon: string){
        return this.controller.query<Stop>("stops", [["stop_lat", lat, "eq"], ["stop_lon", lon, "eq"]]);
    }
    async findByProperty(column: keyof Stop, value: string, exact = false){
        return this.controller.query<Stop>("stops", [[column, value, exact ? "eq" : "like"]])
    }
    async getById(id: string){
        return await this.controller.query<Stop>("stops", [["stop_id", id, "eq"]]);

    }
}