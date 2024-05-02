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
exports.CompanyDbController = void 0;
const DBcontroller_1 = require("../DBcontroller");
class CompanyDbController {
    constructor(schemaName) {
        this.controller = new DBcontroller_1.DbController(schemaName);
    }
    findCompany(stopId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.controller.checkValue("stops", [["stop_id", stopId, "eq"]]);
        });
    }
}
exports.CompanyDbController = CompanyDbController;
