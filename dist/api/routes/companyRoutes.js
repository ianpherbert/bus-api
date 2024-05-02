"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const companyControllers_1 = require("../controllers/companyControllers");
const companyRouter = (0, express_1.Router)({});
companyRouter.get("", companyControllers_1.getCompanies);
exports.default = companyRouter;
