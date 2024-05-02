"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const includeTimestamp = (req, _, next) => {
    req.requestTime = Date.now();
    next();
};
exports.default = includeTimestamp;
