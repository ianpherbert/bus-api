"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dateUtils_1 = require("./dateUtils");
const mappingUtils_1 = require("./mappingUtils");
const stringUtils_1 = require("./stringUtils");
describe('Date Utils Tests', () => {
    it('should return the current date in YYYYMMDD format', () => {
        jest.useFakeTimers().setSystemTime(new Date('2024-01-01'));
        expect((0, dateUtils_1.getStringForNow)()).toBe('20240101');
        jest.useRealTimers();
    });
    it('should parse a date string based on the specified format', () => {
        expect((0, dateUtils_1.parseDate)('20240101')).toEqual(new Date(Date.UTC(2024, 0, 1)));
    });
    it('should format a date object to a string in the specified format', () => {
        const date = new Date('2024-01-01T00:00:00Z');
        expect((0, dateUtils_1.formatDate)(date)).toBe('20240101');
    });
    it('should add weeks to a date string and return the new date in specified format', () => {
        expect((0, dateUtils_1.weeksFromString)('20240101', 1)).toBe('20240108');
    });
    it('should return the day of the week for a given date', () => {
        const date = new Date('2024-01-01T00:00:00Z');
        expect((0, dateUtils_1.getDayOfWeek)(date)).toBe('monday');
    });
    it('should adjust date and time correctly for time strings representing more than 24 hours', () => {
        const date = new Date('2024-01-01T00:00:00Z');
        expect((0, dateUtils_1.formatMoreThan24hourClock)('27:30', date)).toEqual(new Date('2024-01-02T03:30:00Z'));
    });
    it('should adjust date and time correctly for time strings representing more than 48 hours', () => {
        const date = new Date('2024-01-01T00:00:00Z');
        expect((0, dateUtils_1.formatMoreThan24hourClock)('54:30', date)).toEqual(new Date('2024-01-03T06:30:00Z'));
    });
});
describe("mapping utils", () => {
    test("should correctly map db object to api object", () => {
        const mappedObject = (0, mappingUtils_1.dbToApi)({
            foo: "bar",
            bar: "foo"
        }, [{ key: "api", value: true }]);
        expect(mappedObject.api === true);
    });
});
describe("string utils", () => {
    test("should split string into array", () => {
        const testString = "foo, BAR, api ";
        const expectedOutput = ["foo", "bar", "api"];
        const output = (0, stringUtils_1.normaliseStringToArray)(testString);
        expect(expectedOutput.every((it) => output.includes(it))).toBeTruthy();
    });
    test("should split string into array with delimiter", () => {
        const testString = "foo; BAR; api ";
        const expectedOutput = ["foo", "bar", "api"];
        const output = (0, stringUtils_1.normaliseStringToArray)(testString, ";");
        expect(expectedOutput.every((it) => output.includes(it))).toBeTruthy();
    });
    test("should normalize string, french example", () => {
        const testString = "François Bellière a raté son diplôme à cause de Gaëlle.";
        const expectedString = "Francois Belliere a rate son diplome a cause de Gaelle";
        const output = (0, stringUtils_1.normaliseString)(testString);
        expect(output).toBe(expectedString);
    });
    test("should normalize string, german example", () => {
        const testString = "Çaßanova äußerte Überraschung.";
        const expectedString = "Cassanova ausserte Uberraschung";
        const output = (0, stringUtils_1.normaliseString)(testString);
        expect(output).toBe(expectedString);
    });
    test("should normalize string, polish example", () => {
        const testString = "Żółć Gęślą Jaźń dëmonstruje Ćma.";
        const expectedString = "Zolc Gesla Jazn demonstruje Cma";
        const output = (0, stringUtils_1.normaliseString)(testString);
        expect(output).toBe(expectedString);
    });
});
