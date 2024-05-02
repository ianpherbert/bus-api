"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stopControllers_1 = require("../controllers/stopControllers");
const stopRouter = (0, express_1.Router)({});
stopRouter.get("/", stopControllers_1.searchStop);
stopRouter.get("/:stopId", stopControllers_1.getStop);
exports.default = stopRouter;
