"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasValues = void 0;
function hasValues(object) {
    return Object.values(object).some(Boolean);
}
exports.hasValues = hasValues;
