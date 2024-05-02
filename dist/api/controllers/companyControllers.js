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
exports.getCompanies = void 0;
const companies_1 = require("../companies");
const responseType_1 = require("../responseType");
const getCompanies = (_a, res_1, _next_1) => __awaiter(void 0, [_a, res_1, _next_1], void 0, function* ({ requestTime, query }, res, _next) {
    const companies = companies_1.companyArray.map(({ displayName, code, name }) => ({ displayName, code, name }));
    res.status(200).json(new responseType_1.QueryResponseType(companies, query, requestTime));
});
exports.getCompanies = getCompanies;
