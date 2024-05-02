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
exports.findLocation = void 0;
const LocationController_1 = require("../../database/controllers/LocationController");
const ApiErrors_1 = require("../../errors/ApiErrors");
const objectUtils_1 = require("../../utils.ts/objectUtils");
const responseType_1 = require("../responseType");
const findLocation = (_a, res_1) => __awaiter(void 0, [_a, res_1], void 0, function* ({ query, requestTime }, res) {
    const { id, postalcode, name } = query;
    if (!(0, objectUtils_1.hasValues)({ id, postalcode, name })) {
        res.status(400).json(new ApiErrors_1.MissingArgumentError("name, id, or postalcode are mandatory in query", query, { name: "string?", id: "string?", postalcode: "string?" }));
        return;
    }
    const controller = new LocationController_1.LocationDBController();
    const entries = yield controller.findByNamePostalCodeOrId(id, postalcode, name);
    res.status(200).json(new responseType_1.QueryResponseType(entries, query, requestTime));
});
exports.findLocation = findLocation;
