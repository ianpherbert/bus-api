"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apicache_1 = require("apicache");
const variables_1 = require("../../variables");
const cacheCalls = variables_1.env === "local" ? (_, _1, next) => next() : (0, apicache_1.middleware)("10 minutes");
exports.default = cacheCalls;
