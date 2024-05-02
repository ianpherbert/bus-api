"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const testUtils_1 = require("../utils.ts/testUtils");
const DBcontroller_1 = require("./DBcontroller");
describe("DbController", () => {
    jest.mock("pg", () => ({
        Client: class TestClass {
            constructor(_) {
                this.query = () => new Promise((res) => res({ rows: [], rowCount: 0 }));
            }
        }
    }));
    test("should return false for nonexistant value", () => __awaiter(void 0, void 0, void 0, function* () {
        const controller = new DBcontroller_1.DbController("test");
        yield (0, testUtils_1.waitFor)(() => __awaiter(void 0, void 0, void 0, function* () {
            const check = yield controller.checkValue("text", [["key", "value", "eq"]]);
            expect(check).toBeFalsy();
        }));
    }));
    test("should return empty array for query", () => __awaiter(void 0, void 0, void 0, function* () {
        const controller = new DBcontroller_1.DbController("test");
        yield (0, testUtils_1.waitFor)(() => __awaiter(void 0, void 0, void 0, function* () {
            const check = yield controller.query("text", [["key", "value", "eq"]]);
            expect(check).toStrictEqual([]);
        }));
    }));
    test("should return empty array for custom query", () => __awaiter(void 0, void 0, void 0, function* () {
        const controller = new DBcontroller_1.DbController("test");
        yield (0, testUtils_1.waitFor)(() => __awaiter(void 0, void 0, void 0, function* () {
            const check = yield controller.customQuery("SELECT * from test", [["key", "value", "eq"]]);
            expect(check).toStrictEqual([]);
        }));
    }));
    test("should return names", () => __awaiter(void 0, void 0, void 0, function* () {
        const controller = new DBcontroller_1.DbController("test");
        const [hello, goodbye] = controller.getTableNames(["hello", "goodbye"]);
        expect(hello).toEqual("test.hello");
        expect(goodbye).toEqual("test.goodbye");
    }));
});
