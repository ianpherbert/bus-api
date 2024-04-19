import express from "express";
import stopRouter from "./api/routes/stopRoutes";
import { PORT } from "./variables";
import includeTimestamp from "./api/middleware/timeStamp";
import departureRouter from "./api/routes/routeRoutes";
import { postgresClient } from "./database/DBcontroller";
import cacheCalls from "./api/middleware/cacheCalls";

const app = express();

app.listen(PORT, async () => {
  console.info(`connected at: ${PORT}`)
  await postgresClient.connect();
  console.info(`Db connected as user: ${postgresClient.user}`)
}).on("error", (error) => {
  console.error("Error while connecting", error.message)
  throw new Error(error.message);
});

app.use(includeTimestamp, cacheCalls);
app.use("/stop", stopRouter);
app.use("/route", departureRouter);
app.get("/ping", (_a, b) => b.status(200).json({ message: "OK" }))
export default app;