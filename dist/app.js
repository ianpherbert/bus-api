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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stopRoutes_1 = __importDefault(require("./api/routes/stopRoutes"));
const variables_1 = require("./variables");
const timeStamp_1 = __importDefault(require("./api/middleware/timeStamp"));
const routeRoutes_1 = __importDefault(require("./api/routes/routeRoutes"));
const DBcontroller_1 = require("./database/DBcontroller");
const cacheCalls_1 = __importDefault(require("./api/middleware/cacheCalls"));
const locationRoutes_1 = __importDefault(require("./api/routes/locationRoutes"));
const companyRoutes_1 = __importDefault(require("./api/routes/companyRoutes"));
const app = (0, express_1.default)();
app.listen(variables_1.PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.info(`connected at: ${variables_1.PORT}`);
    yield DBcontroller_1.postgresClient.connect();
    console.info(`Db connected as user: ${DBcontroller_1.postgresClient.user}`);
})).on("error", (error) => {
    console.error("Error while connecting", error.message);
    throw new Error(error.message);
});
app.use(timeStamp_1.default, cacheCalls_1.default);
app.use("/stop", stopRoutes_1.default);
app.use("/route", routeRoutes_1.default);
app.use("/location", locationRoutes_1.default);
app.use("/company", companyRoutes_1.default);
app.get("/ping", (_a, b) => b.status(200).json({ message: "OK" }));
exports.default = app;
