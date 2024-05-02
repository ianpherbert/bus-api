"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMoreThan24hourClock = exports.getDayOfWeek = exports.weeksFromString = exports.formatDate = exports.parseDate = exports.getStringForNow = exports.DateFormat = void 0;
const moment_1 = __importDefault(require("moment"));
var DateFormat;
(function (DateFormat) {
    DateFormat["DB"] = "YYYYMMDD";
})(DateFormat || (exports.DateFormat = DateFormat = {}));
function getStringForNow(dateFormat = DateFormat.DB) {
    return formatDate(new Date(), dateFormat);
}
exports.getStringForNow = getStringForNow;
function parseDate(date, dateFormat = DateFormat.DB) {
    return moment_1.default.utc(date, "YYYYMMDD").toDate();
}
exports.parseDate = parseDate;
function formatDate(date, dateFormat = DateFormat.DB) {
    return (0, moment_1.default)(date).format(dateFormat);
}
exports.formatDate = formatDate;
function weeksFromString(date, weeks, dateFormat = DateFormat.DB) {
    return (0, moment_1.default)(date).add(weeks, "weeks").format(dateFormat);
}
exports.weeksFromString = weeksFromString;
function getDayOfWeek(date) {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const dayNumber = date.getDay();
    return days[dayNumber];
}
exports.getDayOfWeek = getDayOfWeek;
function formatMoreThan24hourClock(timeString, date) {
    const [hour, minute] = timeString.split(":").map(Number);
    const moreDays = hour % 24;
    const correctedHour = hour - (24 * moreDays);
    const correctedDate = (0, moment_1.default)(date).add(moreDays, "days")
        .set("hour", correctedHour)
        .set("minute", minute);
    return correctedDate.toDate();
}
exports.formatMoreThan24hourClock = formatMoreThan24hourClock;
