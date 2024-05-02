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
exports.StopDbController = void 0;
const DBcontroller_1 = require("../DBcontroller");
class StopDbController {
    constructor(schemaName) {
        this.controller = new DBcontroller_1.DbController(schemaName);
    }
    findByCoordinates(lat, lon) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.controller.query("stops", [["stop_lat", lat, "eq"], ["stop_lon", lon, "eq"]]);
        });
    }
    findByProperty(column_1, value_1) {
        return __awaiter(this, arguments, void 0, function* (column, value, exact = false) {
            return this.controller.query("stops", [[column, value, exact ? "eq" : "like"]]);
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.controller.query("stops", [["stop_id", id, "eq"]]);
        });
    }
}
exports.StopDbController = StopDbController;
