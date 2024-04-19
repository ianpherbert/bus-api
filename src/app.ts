import express, { Request, Response, NextFunction } from "express";
import stopRouter from "./api/routes/stopRoutes";
import { PORT } from "./variables";
import includeTimestamp from "./api/middleware/timeStamp";
import departureRouter from "./api/routes/routeRoutes";
import { DbController, postgresClient } from "./database/DBcontroller";
import { Stop } from "./database/types";

const app = express();

app.listen(PORT, async () => {
  await postgresClient.connect();
}).on("error", (error) => {
  throw new Error(error.message);
});

app.use(includeTimestamp);
app.use("/stop", stopRouter);
app.use("/route", departureRouter);
app.get("/ping", (_a, b) => b.status(200).json({ message: "OK" }))

export default app;