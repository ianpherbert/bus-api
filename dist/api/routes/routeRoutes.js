"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routeControllers_1 = require("../controllers/routeControllers");
const departureRouter = (0, express_1.Router)({});
departureRouter.get("/stop/:stopId", routeControllers_1.getRoutesForStop);
departureRouter.get("", routeControllers_1.getRoutesForDay);
exports.default = departureRouter;
