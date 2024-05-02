"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normaliseString = exports.normaliseStringToArray = void 0;
function normaliseStringToArray(string, delimiter = ",") {
    return string.split(delimiter).map(it => it.toLocaleLowerCase().trim());
}
exports.normaliseStringToArray = normaliseStringToArray;
function normaliseString(str) {
    return str
        .normalize("NFD")
        .replace(/ä/g, 'a')
        .replace(/ö/g, 'o')
        .replace(/ü/g, 'u')
        .replace(/ß/g, 'ss')
        .replace(/ł/g, 'l')
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^A-Za-z0-9 ]/g, '');
}
exports.normaliseString = normaliseString;
