import { DbController } from "../DBcontroller";
import { Stop } from "../types";

export class CompanyDbController {
    controller: DbController;
    constructor(schemaName: string) {
        this.controller = new DbController(schemaName);
    }
    async findCompany(stopId: string) {
        return await this.controller.checkValue<Stop>("stops", [["stop_id", stopId, "eq"]])
    }
}