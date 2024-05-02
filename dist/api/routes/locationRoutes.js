"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const locationControllers_1 = require("../controllers/locationControllers");
const locationRouter = (0, express_1.Router)({});
locationRouter.get("", locationControllers_1.findLocation);
exports.default = locationRouter;
